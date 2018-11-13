from pprint import pprint
from django.urls import reverse, NoReverseMatch
from rest_framework import serializers
from cotidia.admin.search_dashboard_settings import (
    SUPPORTED_FIELDS_TYPES,
    DYNAMIC_LIST_SUPPORTED_FIELDS_TYPES,
    FIELD_MAPPING,
    DYNAMIC_LIST_FIELD_MAPPING,
    FILTER_MAPPING,
)
from cotidia.admin.filters import DefaultGeneralQueryFilter


class AdminModelSerializer(serializers.ModelSerializer):
    enable_detail_url = True

    def to_representation(self, instance):
        repr = super().to_representation(instance)
        # Must also check that the parent of the parent is not None as the top
        # serializer is always a list serializer
        if (
            serializers.ListSerializer in self.parent.__class__.mro() and
            self.parent.parent is not None
        ):
            try:
                return repr[self.SearchProvider.display_field]
            except AttributeError:
                raise AttributeError(
                    "%s does not have the display_field defined in the SearchProvider sub class" % str(self.__class__.__name__)
                )
        else:
            # This copies the list of keys so we don't have any iteration
            # mutation issues
            keys = list(repr.keys())

            for key in keys:
                # Flattens dicts
                if isinstance(repr[key], dict):
                    serializer = self.fields[key]
                    display_field = serializer.SearchProvider.display_field
                    for subkey, subvalue in repr[key].items():
                        key_name = "{}__{}".format(key, subkey)
                        if key_name not in repr.keys():
                            repr.update({key_name: subvalue})
                    repr[key] = repr[key][display_field]
        return repr

    def get_choices(self):
        try:
            qs = self.get_choice_queryset()
            return [{"value": str(x.uuid), "label": getattr(x, self.SearchProvider.display_field)} for x in qs]
        except AttributeError as e:
            raise AttributeError(
                "%s does not have the display_field defined in the SearchProvider sub class. Error: %s" % (str(self.__class__), str(e))
            )

    def get_related_fields(self):
        if not hasattr(self, "_related_fields"):
            field_representation = self.get_field_representation()
            self._related_fields = list(
                # We make this a set to remove duplicates
                set(
                    ['__'.join(key.split('__')[:-1]) for key in field_representation if key.find('__') >= 0]
                )
            )
        return self._related_fields

    def get_choice_queryset(self):
        return self.Meta.model.objects.all()

    def get_endpoint(self):
        return reverse(
            'generic-api:object-list',
            kwargs={
                'app_label': self.Meta.model._meta.app_label,
                'model': self.Meta.model._meta.model_name
            }
        )

    def get_detail_url(self):
        if self.get_option('enable_detail_url', default=True):
            detail_url = self.get_option('detail_url')

            if not detail_url:
                try:
                    # Here we generate a concrete URL for the detial view based
                    # on a fake ID of `9999`. Later we will string replace this
                    # for the `:id` placeholder to create a prototype URL.
                    fake_detail_url = reverse(
                        '{app_label}-admin:{model_name}-detail'.format(
                            app_label=self.Meta.model._meta.app_label,
                            model_name=self.Meta.model._meta.model_name
                        ),
                        kwargs={'pk': '9999'}
                    )
                except NoReverseMatch:
                    pass
                else:
                    # Create prototype URL from concrete one.
                    return fake_detail_url.replace('9999', ':id')

    def get_field_representation(self, label_prefix="", bypass_available_columns=False):
        # Checks if there is a cached version
        if not hasattr(self, "_field_representation"):

            # Gets all columns in the current serializer
            self.get_columns()
            field_representation = {}

            for field_name, field in self.fields.items():
                if not bypass_available_columns and field_name not in self._available_columns:
                    continue

                # Gets the most specific class of we support for the given field type if not it return None
                field_type = next(
                    iter(
                        [t for t in SUPPORTED_FIELDS_TYPES if isinstance(field, t)]
                    ),
                    None
                )
                label = field_name.replace("__", " ").replace('_', ' ').title()
                if label_prefix:
                    label = label_prefix + " " + label

                # If the instance is another Admin Model serializer we get the
                # field representation and flatten it
                if isinstance(field, AdminModelSerializer):
                    nested_repr = field.get_field_representation(label_prefix=label, bypass_available_columns=True)
                    for key, value in nested_repr.items():
                        sub_field_name = "{}__{}".format(field_name, key)
                        if bypass_available_columns or sub_field_name in self._available_columns:
                            field_representation[sub_field_name] = value
                    default_field_repr = FIELD_MAPPING[AdminModelSerializer.__name__]()
                    default_field_repr["configuration"] = {}
                    default_field_repr["configuration"]["mode"] = 'options'
                    default_field_repr["configuration"]["options"] = field.get_choices()
                    default_field_repr["label"] = label
                    field_representation[field_name] = default_field_repr

                # If there is a list serializer we try and get the options from
                # the child field or make the field unfilterable
                elif isinstance(field, serializers.ListSerializer):
                    try:
                        default_field_ref = FIELD_MAPPING[field.__class__.__name__]()
                        options = field.child.get_choices()
                        default_field_ref["configuration"] = {
                            "mode": "options",
                            "options": options,
                        }
                    except AttributeError:
                        default_field_ref = FIELD_MAPPING[field.child.__class__.__name__]()
                        default_field_ref["filter"] = None
                    default_field_ref["label"] = label
                    field_representation[field_name] = default_field_ref
                else:
                    # Check we can filter by a supported field
                    if field_type is None:
                        print("Unsupported field {} of type {}".format(field_name,field))
                    else:
                        # Gets the default field_repr
                        default_field_ref = FIELD_MAPPING[field_type.__name__]()
                        if hasattr(field, "choices"):
                            # Adds choices if there is a choices field on the
                            # serializer
                            default_field_ref["filter"] = 'choice'
                            default_field_ref["configuration"] = {
                                'mode': 'options',
                                'options': [
                                    {"value": value, "label": label}
                                    for value, label in field.choices.items()
                                ]
                            }
                        default_field_ref["label"] = label
                        field_representation[field_name] = default_field_ref

            # Applies any user defined field_repr values
            try:
                override_repr = self.SearchProvider.field_representation
                override_repr = self.make_config_compatible(override_repr)
                for key, default_field_repr in field_representation.items():
                    if not bypass_available_columns and key not in self._available_columns:
                        continue
                    try:
                        overrides = override_repr[key]
                        default_field_repr.update(overrides)
                    except (AttributeError, KeyError):
                        pass
                    field_representation[key] = default_field_repr
                for key, value in override_repr.items():
                    if bypass_available_columns or key in self._available_columns:
                        if key not in field_representation.keys():
                            field_representation[key] = value
            except AttributeError:
                pass
            self._field_representation = field_representation

        return self._field_representation

    def make_config_compatible(self, config):
        """
        Makes the old style config work with new dynamic list config
        """
        for key, value in config.items():
            # Upgrades to new choice filter config
            if value.get('filter') in ['choice', 'choice-single'] and value.get('options') is not None:
                config[key]["configuration"] = {
                    'mode': 'options',
                    'options': value["options"]
                }
        return config

    def get_option(self, attr, default=None):
        if hasattr(self, "SearchProvider"):
            return getattr(self.SearchProvider, attr, default)

        return default

    def get_general_query_fields(self):
        return self.get_option(
            'general_query_fields',
            default=[self.get_option(
                'display_field',
                default=['id']
            )]
        )

    def get_default_columns(self):
        return self.get_option('default_columns', default=[
            self.get_display_field()
        ])

    def get_display_field(self):
        if self.get_option('display_field') is not None:
            return self.get_option('display_field')
        else:
            return 'id'

    def get_columns(self):
        if hasattr(self, "_available_columns"):
            return self._columns

        self._available_columns = []

        if self.get_option('columns'):
            self._columns = self.get_option('columns')

            for column in self._columns:
                self._available_columns.extend(column['columns'])
        else:
            for field_name, field in self.fields.items():
                self._available_columns.append(field_name)
                if isinstance(field, AdminModelSerializer):
                    field.get_columns()
                    nested_columns = field._available_columns
                    for key in nested_columns:
                        self._available_columns.append("{}__{}".format(field_name, key))

            self._columns = [{
                'label': 'Columns',
                'columns': sorted(self._available_columns)
            }]

        return self._columns

class SortSerializer(serializers.Serializer):
    data = serializers.ListField(
        child=serializers.UUIDField()
    )


class AdminSearchLookupSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()

class BaseDynamicListSerializer(serializers.ModelSerializer):
    _get_filters = None

    def _assertions(self):
        """
        A series of assertions about the class that must always be true
        """
        assert hasattr(self, "SearchProvider"), "Serializer must have a SearchProvider defined"

        assert hasattr(self.SearchProvider, "exclude_filters") != hasattr(self.SearchProvider, "filters")
        # (
        #     "Serializer must have either filters or exclude filters "
        #     "defined, and not both"
        # )


    def get_nested_serializers(self):
        return [
            name for name, field in self.fields.items()
            if isinstance(field, BaseDynamicListSerializer)
        ]

    def get_all_filters(self, exclude, prefix=""):

        filters = {}
        override_filters = getattr(self.SearchProvider, "override_filters", {})

        for name, field in self.fields.items():
            if name not in exclude:
                if isinstance(field, BaseDynamicListSerializer):
                    nested_filters = field.get_filters(
                        prefix="{}__{}".format(
                            name,
                            prefix,
                        )
                    )
                    for key, val in nested_filters.items():
                        nested_name = '{}__{}'.format(
                            name,
                            key
                        )
                        if nested_name not in exclude:
                            filters[nested_name] = val
                    filters[name] = choose_filter(field, name, prefix)
                if name in override_filters:
                    filters[name] = override_filters[name]
                else:
                    chosen_filter = choose_filter(field, name, prefix)
                    if chosen_filter is not None:
                        filters[name] = chosen_filter
        return filters


    def get_filters(self, prefix=""):
        self._assertions()

        # Short circuit the calculation if we have a cached version
        if self._get_filters is not None:
            return self._get_filters

        self._get_filters = {}

        exclude_list = getattr(self.SearchProvider, "exclude_filters", [])
        all_filters = self.get_all_filters(exclude_list, prefix=prefix)
        if (
            hasattr(self.SearchProvider, "filters") and
            self.SearchProvider.filters != "__all__"
        ):
            for filter_name in self.SearchProvider.filters:
                if filter_name in all_filters:
                    self._get_filters[filter_name] = all_filters[filter_name]
                else:
                    try:
                        self._get_filters[filter_name] = self.SearchProvider.override_filters[filter_name]
                    except (KeyError, AttributeError) as e:
                        raise AssertionError("Any additional filters must be defined in override filters")

        else:
            self._get_filters = all_filters
        return self._get_filters


    def to_representation(self, instance):
        repr = super().to_representation(instance)
        # Must also check that the parent of the parent is not None as the top
        # serializer is always a list serializer
        if (
            serializers.ListSerializer in self.parent.__class__.mro() and
            self.parent.parent is not None
        ):
            try:
                return repr[self.SearchProvider.display_field]
            except AttributeError:
                raise AttributeError(
                    "%s does not have the display_field defined in the SearchProvider sub class" % str(self.__class__.__name__)
                )
        else:
            # This copies the list of keys so we don't have any iteration
            # mutation issues
            keys = list(repr.keys())

            for key in keys:
                # Flattens dicts
                if isinstance(repr[key], dict):
                    serializer = self.fields[key]
                    display_field = serializer.SearchProvider.display_field
                    for subkey, subvalue in repr[key].items():
                        key_name = "{}__{}".format(key, subkey)
                        if key_name not in repr.keys():
                            repr.update({key_name: subvalue})
                    repr[key] = repr[key][display_field]
        return repr

    def get_choices(self):
        try:
            qs = self.get_choice_queryset()
            return [{"value": str(x.uuid), "label": getattr(x, self.SearchProvider.display_field)} for x in qs]
        except AttributeError as e:
            raise AttributeError(
                "%s does not have the display_field defined in the SearchProvider sub class. Error: %s" % (str(self.__class__), str(e))
            )

    def get_related_fields(self):
        if not hasattr(self, "_related_fields"):
            field_representation = self.get_field_representation()
            self._related_fields = list(
                # We make this a set to remove duplicates
                set(
                    ['__'.join(key.split('__')[:-1]) for key in field_representation if key.find('__') >= 0]
                )
            )
        return self._related_fields

    def get_choice_queryset(self):
        return self.Meta.model.objects.all()

    def get_endpoint(self):
        return reverse(
            'generic-api:dynamic-list',
            kwargs={
                'app_label': self.Meta.model._meta.app_label,
                'model': self.Meta.model._meta.model_name
            }
        )

    def get_detail_url(self):
        if self.get_option('enable_detail_url', default=True):
            detail_url = self.get_option('detail_url')

            if not detail_url:
                try:
                    # Here we generate a concrete URL for the detial view based
                    # on a fake ID of `9999`. Later we will string replace this
                    # for the `:id` placeholder to create a prototype URL.
                    fake_detail_url = reverse(
                        '{app_label}-admin:{model_name}-detail'.format(
                            app_label=self.Meta.model._meta.app_label,
                            model_name=self.Meta.model._meta.model_name
                        ),
                        kwargs={'pk': '9999'}
                    )
                except NoReverseMatch:
                    pass
                else:
                    # Create prototype URL from concrete one.
                    return fake_detail_url.replace('9999', ':id')

    def get_general_query_filter(self):
        if hasattr(self.SearchProvider, "general_query_filter"):
            return self.SearchProvider.general_query_filter
        elif hasattr(self.SearchProvider, "general_query_fields"):
            return DefaultGeneralQueryFilter(
                fields=self.SearchProvider.general_query_fields
            )
        else:
            return None
    def get_field_representation(self, label_prefix="", bypass_available_columns=False):
        # Checks if there is a cached version
        if not hasattr(self, "_field_representation"):

            # Gets all columns in the current serializer
            self.get_columns()
            field_representation = {}

            for field_name, field in self.fields.items():
                if not bypass_available_columns and field_name not in self._available_columns:
                    continue

                # Gets the most specific class of we support for the given field type if not it return None
                field_type = next(
                    iter(
                        [t for t in SUPPORTED_FIELDS_TYPES if isinstance(field, t)]
                    ),
                    None
                )
                label = field_name.replace("__", " ").replace('_', ' ').title()
                if label_prefix:
                    label = label_prefix + " " + label

                # If the instance is another Admin Model serializer we get the
                # field representation and flatten it
                if isinstance(field, BaseDynamicListSerializer):
                    nested_repr = field.get_field_representation(label_prefix=label, bypass_available_columns=True)
                    for key, value in nested_repr.items():
                        sub_field_name = "{}__{}".format(field_name, key)
                        if bypass_available_columns or sub_field_name in self._available_columns:
                            field_representation[sub_field_name] = value
                    default_field_repr = DYNAMIC_LIST_FIELD_MAPPING[BaseDynamicListSerializer.__name__]()
                    default_field_repr["label"] = label
                    default_field_repr["filter"] = (
                        field_name if field_name in self.get_filters() else None
                    )
                    field_representation[field_name] = default_field_repr

                # If there is a list serializer we try and get the options from
                # the child field or make the field unfilterable
                elif isinstance(field, serializers.ListSerializer):
                    try:
                        default_field_ref = DYNAMIC_LIST_FIELD_MAPPING[field.__class__.__name__]()
                    except AttributeError:
                        default_field_ref = DYNAMIC_LIST_FIELD_MAPPING[field.child.__class__.__name__]()
                    default_field_ref["label"] = label
                    default_field_ref["filter"] = (
                        field_name if field_name in self.get_filters() else None
                    )
                    field_representation[field_name] = default_field_ref
                else:
                    # Check we can filter by a supported field
                    if field_type is None:
                        print("Unsupported field {} of type {}".format(field_name, field))
                    else:
                        # Gets the default field_repr
                        default_field_ref = DYNAMIC_LIST_FIELD_MAPPING[field_type.__name__]()
                        default_field_ref["label"] = label
                        default_field_ref["filter"] = (
                            field_name if field_name in self.get_filters() else None
                        )
                        field_representation[field_name] = default_field_ref

            # Applies any user defined field_repr values
            try:
                override_repr = self.SearchProvider.field_representation
                for key, default_field_repr in field_representation.items():
                    if not bypass_available_columns and key not in self._available_columns:
                        continue
                    try:
                        overrides = override_repr[key]
                        default_field_repr.update(overrides)
                    except (AttributeError, KeyError):
                        pass
                    field_representation[key] = default_field_repr
                for key, value in override_repr.items():
                    if bypass_available_columns or key in self._available_columns:
                        if key not in field_representation.keys():
                            field_representation[key] = value
            except AttributeError:
                pass
            self._field_representation = field_representation

        return self._field_representation

    def get_filter_representation(self):
        return dict(
            [
                (name, f.get_representation())
                for name, f in self.get_filters().items()
            ]
        )


    def get_option(self, attr, default=None):
        if hasattr(self, "SearchProvider"):
            return getattr(self.SearchProvider, attr, default)

        return default

    def get_general_query_fields(self):
        return self.get_option(
            'general_query_fields',
            default=[self.get_option(
                'display_field',
                default=['id']
            )]
        )

    def get_default_columns(self):
        return self.get_option('default_columns', default=[
            self.get_display_field()
        ])

    def get_display_field(self):
        if self.get_option('display_field') is not None:
            return self.get_option('display_field')
        else:
            return 'id'

    def get_columns(self):
        if hasattr(self, "_available_columns"):
            return self._columns

        self._available_columns = []

        if self.get_option('columns'):
            self._columns = self.get_option('columns')

            for column in self._columns:
                self._available_columns.extend(column['columns'])
        else:
            for field_name, field in self.fields.items():
                self._available_columns.append(field_name)
                if isinstance(field, BaseDynamicListSerializer):
                    field.get_columns()
                    nested_columns = field._available_columns
                    for key in nested_columns:
                        self._available_columns.append("{}__{}".format(field_name, key))

            self._columns = [{
                'label': 'Columns',
                'columns': sorted(self._available_columns)
            }]

        return self._columns

def choose_filter(field, field_name, prefix):
    # Get the most specific class we suppport for each field
    field_type = next(
        iter([t for t in DYNAMIC_LIST_SUPPORTED_FIELDS_TYPES if isinstance(field, t)]),
        None
    )
    if field_type is None:
        if isinstance(field, BaseDynamicListSerializer):
            return FILTER_MAPPING["BaseDynamicListSerializer"](
                field=field, field_name=field_name, prefix=prefix
            )
        elif isinstance(field, serializers.ListSerializer):
            return choose_filter(field.child, field_name, prefix)
        elif isinstance(field, serializers.ReadOnlyField):
            return None # Don't generate filters for read only fields
        else:
            raise ValueError(
                "Field {} not supported".format(field.__class__)
            )
    filter_class = FILTER_MAPPING.get(field_type.__name__)
    if filter_class:
        return filter_class(
            field=field,
            field_name=field_name,
            prefix=prefix
        )
    return None