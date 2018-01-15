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

from rest_framework import fields, serializers

from cotidia.admin.conf import settings
from cotidia.admin.serializers import AdminModelSerializer

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
        "filter": "number"
    }),
    "ManyRelatedField": (lambda: {
        "display": "verbatim",
        "many": "True",
        "filter": "text"
    }),

    "ListSerializer": (lambda: {
        "display": "verbatim",
        "filter": "text"
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


def get_field_representation(field_name, field, model, prefix="",max_depth=MAX_SUBSERIALIZER_DEPTH):
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
                    max_depth=max_depth -1)

    # Gets the base representation for the given field type
    field_representation = FIELD_MAPPING[field_type.__name__]()
    # Formats the label by changing _s to spaces and capitalising the first
    # letter of each word
    field_representation['label'] =\
        field_name.replace("__", " ").replace("_", " ").title()
    try:
        field_representation['options'] = list(map(lambda x: {"value": x[0], "label": x[1]}, field.choices.items()))
    except AttributeError:
        pass

    return {prefix + field_name: field_representation}


def get_fields_from_model(model):
    return get_fields_from_serializer(get_model_serializer_class(model)())


def get_fields_from_serializer(serializer, prefix="",max_depth=MAX_SUBSERIALIZER_DEPTH):
    fields_representation = {}
    fields = serializer.fields
    for f in fields:
        field_representation = get_field_representation(
                f,
                fields[f],
                serializer,
                prefix,
                max_depth
                )
        if field_representation is not None:
            fields_representation.update(field_representation)
        else:
            print("Field not supported: %s" % fields[f])

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


def get_model_structure(
        model,
        endpoint=None,
        detail_endpoint=None,
        token=None,
        default_columns=None,
        default_filters=None,
        default_order=None
        ):
    serializer = get_model_serializer_class(model)()
    structure = {
            "columns": get_fields_from_serializer(serializer),
            "defaultColumns": get_serializer_default_columns(serializer)

            }
    if endpoint is not None:
        structure['endpoint'] = endpoint
    if detail_endpoint is not None:
        structure['detailURL'] = detail_endpoint
    if token is not None:
        structure['authToken'] = token
    if default_columns:
        structure['defaultColumns'] = default_columns
    if default_filters:
        structure['defaultFilters'] = default_filters
    if default_order:
        structure['defaultOrderBy'] = default_order[0]

    return structure
