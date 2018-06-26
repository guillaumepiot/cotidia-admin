from rest_framework import serializers
from cotidia.admin.search_dashboard_settings import (
    SUPPORTED_FIELDS_TYPES,
    FIELD_MAPPING
)

class AdminModelSerializer(serializers.ModelSerializer):

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
                    for subkey, subvalue in repr[key].items():
                        key_name ="{}__{}".format(key, subkey)
                        if key_name not in repr.keys():
                            repr.update({key_name: subvalue})
        return repr

    def get_choices(self):
        try:
            qs = self.get_choice_queryset()
            return [{"value": str(x.uuid), "label": getattr(x, self.SearchProvider.display_field)} for x in qs]
        except AttributeError as e:
            print(e)
            raise AttributeError(
                "%s does not have the display_field defined in the SearchProvider sub class" % str(self.__class__.__name__)
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


    def get_field_representation(self):
        if not hasattr(self, "_field_representation"):
            repr = {}

            for field_name, field in self.fields.items():
                # Gets the most specific class of we support for the given field type if not it return None
                field_type = next(
                    iter(
                        [t for t in SUPPORTED_FIELDS_TYPES if isinstance(field, t)]
                    ),
                    None
                )
                label = field_name.replace("__", " ").replace('_', ' ').title()
                if isinstance(field, AdminModelSerializer):
                    nested_repr = field.get_field_representation()
                    for key, value in nested_repr.items():
                        repr["{}__{}".format(field_name, key)] = value
                    default_field_repr = FIELD_MAPPING[AdminModelSerializer.__name__]()
                    default_field_repr["options"] = field.get_choices()
                    default_field_repr["label"] = label
                    repr[field_name] = default_field_repr
                elif isinstance(field, serializers.ListSerializer):
                    default_field_ref = FIELD_MAPPING[field.__class__.__name__]()
                    default_field_ref["options"] = field.child.get_choices()
                    default_field_ref["label"] = label
                    repr[field_name] = default_field_ref
                else:
                    if field_type is None:
                        print("Unsupported field {} of type {}".format(field_name,field))
                    else:
                        default_field_ref = FIELD_MAPPING[field_type.__name__]()
                        if hasattr(field, "choices"):
                            choices = field.choices
                            default_field_ref["filter"] = 'choice'
                            default_field_ref["options"] = [
                                {"value": value, "label": label} for value, label in field.choices.items()
                            ]
                        default_field_ref["label"] = label
                        repr[field_name] = default_field_ref

            try:
                override_repr = self.SearchProvider.field_representation
                for key, default_field_repr in repr.items():
                    try:
                        overrides = override_repr[key]
                        default_field_repr.update(overrides)
                    except (AttributeError, KeyError):
                        pass
                    repr[key] = default_field_repr
                for key, value in override_repr.items():
                    if key not in repr.keys():
                        repr[key] = value
            except AttributeError:
                pass
            self._field_representation = repr

        return self._field_representation

    def get_primary_color(self):
        try:
            return self.SearchProvider.primary_color
        except AttributeError:
            return '#00abd3'

    def get_global_list_handling(self):
        try:
            return self.SearchProvider.list_handling
        except AttributeError:
            return None

    def get_date_format(self):
        try:
            return self.SearchProvider.date_format
        except AttributeError:
            return None

    def get_datetime_format(self):
        try:
            return self.SearchProvider.datetime_format
        except AttributeError:
            return None

    def get_categorise_by(self):
        try:
            return self.SearchProvider.categorise_by
        except AttributeError:
            return None

    def get_columns_configurable(self):
        try:
            return self.SearchProvider.columns_configurable
        except AttributeError:
            return True

    def get_batch_actions(self):
        try:
            return self.SearchProvider.batch_actions
        except AttributeError:
            return []

    def get_general_query_fields(self):
        if hasattr(self, "SearchProvider"):
            if hasattr(self.SearchProvider, "general_query_fields"):
                return self.SearchProvider.general_query_fields
            elif hasattr(self.SearchProvider, "display_field"):
                return [self.SearchProvider.display_field]
        return ['id']

    def get_default_columns(self):
        try:
            return self.SearchProvider.default_columns
        except AttributeError:
            try:
                if self.SearchProvider.display_field:
                    return [self.SearchProvider.display_field]
                else:
                    return ['id']
            except:
                return ['id']

    def get_list_fields(self):
        try:
            return self.SearchProvider.get_list_fields
        except AttributeError:
            return None


class SortSerializer(serializers.Serializer):
    data = serializers.ListField(
        child=serializers.UUIDField()
    )


class AdminSearchLookupSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
