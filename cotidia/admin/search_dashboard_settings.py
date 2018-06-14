from rest_framework import serializers, fields

SUPPORTED_FIELDS_TYPES = sorted(
    [
        fields.UUIDField,
        fields.DateTimeField,
        fields.DateField,
        fields.TimeField,
        fields.EmailField,
        fields.CharField,
        fields.IntegerField,
        fields.FloatField,
        fields.DecimalField,
        fields.ChoiceField,
        fields.BooleanField,
        fields.NullBooleanField,
        # AdminModelSerializer,
        # serializers.ManyRelatedField,
        # serializers.ListSerializer
    ],
    key=lambda x: len(x.mro()),
    reverse=True
)
print(SUPPORTED_FIELDS_TYPES)

FIELD_MAPPING = {
    "DateTimeField": (lambda: {
        "display": "datetime",
        "filter": "date"
    }),
    "EmailField": (lambda: {
        "display": "link:mailto",
        "filter": "text"
    }),
    "DateField": (lambda: {
        "display": "date",
        "filter": "date"
    }),
    "TimeField": (lambda: {
        "display": "datetime",
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
    "FloatField": (lambda: {
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
    # "AdminModelSerializer": (lambda: {
    #     "display": "verbatim",
    #     "many": "True",
    #     "filter": "choice"
    # }),
    # "ManyRelatedField": (lambda: {
    #     "display": "verbatim",
    #     "many": "True",
    #     "filter": "text"
    # }),
    "ListSerializer": (lambda: {
        "display": "verbatim",
        "filter": "choice"
    }),
}