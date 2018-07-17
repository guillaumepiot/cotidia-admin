from django.db.models.fields import (
    UUIDField,
    DateTimeField,
    DateField,
    CharField,
    IntegerField,
    BooleanField,
    AutoField,
    TextField,
)
from django.apps import apps
from django.db.models import Q, F, Count, Case, When
from django.urls import reverse
from django.core.exceptions import ValidationError

from rest_framework import fields, serializers

from cotidia.admin.conf import settings
from cotidia.admin.serializers import AdminModelSerializer
from cotidia.admin.filters import FILTERS

MAX_SUBSERIALIZER_DEPTH = settings.ADMIN_MAX_SUBSERIALIZER_DEPTH

SUPPORTED_FIELD_TYPES_MODEL = [
    UUIDField,
    DateTimeField,
    DateField,
    CharField,
    IntegerField,
    BooleanField,
    AutoField,
    TextField,
]

SUPPORTED_FIELD_TYPES_SERIALIZER = [
    fields.UUIDField,
    fields.DateTimeField,
    fields.DateField,
    fields.TimeField,
    fields.CharField,
    fields.IntegerField,
    fields.DecimalField,
    fields.ChoiceField,
    fields.BooleanField,
    fields.NullBooleanField,
    AdminModelSerializer,
    serializers.ManyRelatedField,
    serializers.ListSerializer
]

FIELD_MAPPING = {
    "DateTimeField": (lambda: {
        "display": "datetime",
        "filter": "date"
    }),
    "UUIDField": (lambda: {
        "display": "verbatim",
        "filter": "text"
    }),
    "DateField": (lambda: {
        "display": "date",
        "filter": "date"
    }),
    "TimeField": (lambda: {
        "display": "date",
        "filter": "date"
    }),
    "CharField": (lambda: {
        "display": "verbatim",
        "filter": "text"
    }),
    "ChoiceField": (lambda: {
        "display": "verbatim",
        "filter": "choice"
    }),
    "IntegerField": (lambda: {
        "display": "verbatim",
        "filter": "number"
    }),
    "DecimalField": (lambda: {
        "display": "verbatim",
        "filter": "number"
    }),
    "BooleanField": (lambda: {
        "display": "boolean",
        "filter": "boolean"
    }),
    "NullBooleanField": (lambda: {
        "display": "boolean",
        "filter": "boolean"
    }),
    "TextField": (lambda: {
        "display": "verbatim",
        "filter": "text"
    }),
    "AutoField": (lambda: {
        "display": "verbatim",
        "filter": "number"
    }),
    "AdminModelSerializer": (lambda: {
        "display": "verbatim",
        "many": "True",
        "filter": "choice"
    }),
    "ManyRelatedField": (lambda: {
        "display": "verbatim",
        "many": "True",
        "filter": "text"
    }),
    "ListSerializer": (lambda: {
        "display": "verbatim",
        "filter": "choice"
    }),
}


def get_model_serializer_class(model_class):
    try:
        return model_class.SearchProvider.serializer()
    except AttributeError:
        try:
            class GenericSerializer(AdminModelSerializer):
                class SearchProvider:
                    field_representation = model_class.SearchProvider.field_representation

                class Meta:
                    model = model_class
                    fields = '__all__'
            return GenericSerializer

        except AttributeError:
            class GenericSerializer(AdminModelSerializer):
                class Meta:
                    model = model_class
                    fields = '__all__'
            return GenericSerializer


def get_field_representation(field_name, field, prefix="", max_depth=MAX_SUBSERIALIZER_DEPTH):
    """ Creates a dict object for a given field using field mapping above
        Fields not in (or a subclass of) elements in the SUPPORTED_FIELD_TYPES
        list will return as "None"
    """
    # Gets the first element that the field is an instance of The list is
    # sorted so the most specific classes are checked first using mro()
    sorted_types = sorted(
        SUPPORTED_FIELD_TYPES_SERIALIZER,
        key=lambda x: len(x.mro())
    )

    field_type = next(
        iter([t for t in sorted_types if isinstance(field, t)]),
        None)
    if field_type is None:
        return None

    if issubclass(field_type, serializers.ModelSerializer):
        if max_depth <= 0:
            return {}
        else:
            return get_fields_from_serializer(
                field,
                prefix=("%s%s__") % (
                    prefix,
                    field_name
                ),
                max_depth=max_depth - 1
            )

    # Gets the base representation for the given field type
    field_representation = FIELD_MAPPING[field_type.__name__]()
    # Formats the label by changing _s to spaces and capitalising the first
    # letter of each word
    field_representation['label'] = \
        field_name.replace("__", " ").replace("_", " ").title()

    if hasattr(field, 'choices'):
        field_representation['options'] = list(map(lambda x: {"value": x[0], "label": x[1]}, field.choices.items()))
    elif serializers.BaseSerializer in field_type.mro():
        if field_representation['filter'] == 'choice':
            field_representation['options'] = field.child.get_choices()
    elif field_representation['filter'] == 'choice':
        field_representation['options'] = field.get_choices()

    return {prefix + field_name: field_representation}


def get_fields_from_model(model):
    return get_fields_from_serializer(get_model_serializer_class(model)())


def get_fields_from_serializer(serializer, prefix="", max_depth=MAX_SUBSERIALIZER_DEPTH):
    fields_representation = {}
    fields = serializer.fields
    for f in fields:
        field_representation = get_field_representation(
            f,
            fields[f],
            prefix,
            max_depth
        )
        if field_representation is not None:
            fields_representation.update(field_representation)

    try:
        user_defined_representation = serializer.SearchProvider.field_representation
        for field in user_defined_representation:
            try:
                fields_representation[field].update(user_defined_representation[field])
            except KeyError as e:
                pass
    except AttributeError as e:
        pass

    return fields_representation


def get_serializer_default_columns(serializer):
    fields = []
    try:
        fields = serializer.SearchProvider.default_columns
    except (AttributeError):
        # Gets all fields excluding sub serializer fields and uuid fields
        fields = [f for f in get_fields_from_serializer(serializer).keys() if "__" not in f if "uuid" not in f]
    return fields


def get_serializer_list_fields(serializer):
    fields = None
    try:
        fields = serializer.SearchProvider.list_fields
    except AttributeError:
        pass
    return fields


def get_serializer_list_mode(serializer):
    try:
        return serializer.SearchProvider.default_list_mode
    except AttributeError:
        pass

    return 'table'


def get_item_url(model, obj):
        url_name = "{}-admin:{}-detail".format(
            model._meta.app_label,
            model._meta.model_name
        )
        return reverse(url_name, kwargs={"pk": obj.id})


def search_objects(query):
    results = []

    if not query:
        return []

    for m in settings.ADMIN_GLOBAL_SEARCH:
        app_label, model_name = m["model"].split(".")
        model = apps.get_model(app_label, model_name)

        q_objects = Q()

        for field in m["fields"]:
            for q in query.split(" "):
                filter_args = {}
                lookup = "__icontains"
                filter_args[field + lookup] = q
                q_objects.add(Q(**filter_args), Q.OR)

        for item in model.objects.filter(q_objects):
            results.append({
                "type": model._meta.verbose_name,
                "label": item.__str__(),
                "value": get_item_url(model, item)
            })

    return results


def get_queryset(model_class, serializer_class, filter_args=None):
    serializer = serializer_class()

    field_repr = serializer.get_field_representation()
    related_fields = serializer.get_related_fields()

    # Get the queryset
    if serializer.get_option('get_queryset'):
        qs = serializer.get_option('get_queryset')()
    else:
        qs = model_class.objects.all()

    # Pre-fetch related fields
    qs = qs.select_related(*related_fields)

    # filters the general_search
    q_object = Q()
    q_list = filter_args.getlist('_q')
    for val in q_list:
        q_object = reduce(
            lambda x, y: x | y,
            [
                Q(**{x + '__icontains': val})
                for x in serializer.get_general_query_fields()
            ],
        )

    if q_object:
        qs = qs.filter(q_object)

    # Field filtering
    for field in field_repr.keys():
        filter_params = get_query_dict_value(filter_args, field)
        if filter_params:
            # If the field has a custom filter function, use it instead
            if hasattr(serializer, 'filter_' + field):
                func = getattr(serializer, 'filter_' + field)
                qs = func(qs, get_query_dict_value(filter_args, field))
            else:
                suffix = ""
                if field_repr[field].get('prep_function', False):
                    filter_params = [
                        field_repr[field]["prep_function"](param)
                        for param in filter_params
                    ]
                elif field_repr[field].get('filter_lookup_key', None):
                    suffix = "__" + field_repr[field].get('filter_lookup_key')
                elif field_repr[field].get('foreign_key', False):
                    suffix = "__uuid"
                filter_type = field_repr[field]['filter']
                qs = FILTERS[filter_type](
                    qs,
                    field + suffix,
                    filter_params
                )

    # Extra filter
    extra_filters = serializer.get_option('extra_filters')

    # Apply extra filters
    if extra_filters:
        for k in extra_filters.keys():
            if filter_args.getlist(k):
                func = getattr(serializer, 'filter_' + k)
                qs = func(qs, get_query_dict_value(filter_args, k))

    raw_ordering_params = filter_args.getlist('_order')
    ordering_params = []
    for param in raw_ordering_params:
        desc = False
        key = param
        if param[0] == '-':
            desc = True
            key = param[1:]
        custom_ordering = [
            ('-' + x) if desc else x
            for x in field_repr[key].get('ordering_fields', [key])
        ]
        ordering_params += custom_ordering
        
    if ordering_params:
        # Here we add an annotation to make sure when we order, the value is
        # empty
        first_field = ordering_params[0]
        clean_field_name = first_field[
            1:] if first_field[0] == '-' else first_field
        try:
            condition_blank = Q(**{clean_field_name + "__exact": ""})
            annotation = {"val_is_empty": Count(Case(
                When(condition_blank, then=1), output_field=CharField(),
            ))}
            qs = qs.annotate(**annotation)
            ordering_params = ["val_is_empty"] + ordering_params
        except (ValidationError, ValueError):
            # This is added as number an dates all have sensible defaults
            pass
        parsed_ordering_params = [
            parse_ordering(x) for x in ordering_params
        ]
        qs = qs.order_by(*parsed_ordering_params)
    else:
        default_order_by = serializer.get_option('default_order_by')
        if default_order_by:
            qs = qs.order_by(default_order_by)

    return qs


def get_sub_serializer(serializer, field):
    fields = field.split("__")
    sub_serializer = serializer()
    for f in fields:
        sub_serializer = sub_serializer.fields[f].child

    return sub_serializer


def get_query_dict_value(d, k):
    v = d.get(k)
    if isinstance(v, list):
        v = d.getlist(k)
    return v


def parse_ordering(order_val):
    if order_val[0] == "-":
        return F(order_val[1:]).desc(nulls_last=True)
    else:
        return F(order_val).asc(nulls_last=True)
