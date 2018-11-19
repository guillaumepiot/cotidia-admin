import uuid

from rest_framework import serializers, fields

from cotidia.admin.filters import (
    ExactFilter,
    ContainsFilter,
    DateTimeFilter,
    NumericFilter,
    BooleanFilter,
    ChoiceFilter,
    ForeignKeyFilter,
)


SUPPORTED_FIELDS_TYPES = sorted(
    [
        fields.UUIDField,
        fields.DateTimeField,
        fields.DateField,
        fields.TimeField,
        fields.EmailField,
        fields.CharField,
        fields.UUIDField,
        fields.IntegerField,
        fields.FloatField,
        fields.DecimalField,
        fields.ChoiceField,
        fields.BooleanField,
        fields.NullBooleanField,
        serializers.ListSerializer,
        serializers.RelatedField,
        serializers.ManyRelatedField,
        serializers.SerializerMethodField,
    ],
    key=lambda x: len(x.mro()),
    reverse=True
)

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
    "UUIDField": (lambda: {
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
    "AdminModelSerializer": (lambda: {
        "display": "verbatim",
        "filter": "choice",
        "foreign_key": True
    }),
    "ListSerializer": (lambda: {
        "display": "verbatim",
        "filter": "choice",
        "foreign_key": True
    }),
    "RelatedField": (lambda: {
        "display": "verbatim",
        "filter": "text",
        "foreign_key": True
    }),
    "ManyRelatedField": (lambda: {
        "display": "verbatim",
        "filter": "text",
        "foreign_key": True
    }),
    "SerializerMethodField": (lambda: {
        "display": "verbatim",
        "filter": "text"
    }),
}

FILTER_MAPPING = {
    "DateTimeField": DateTimeFilter,
    "EmailField": ContainsFilter,
    "DateField": DateTimeFilter,
    "TimeField": DateTimeFilter,
    "CharField": ContainsFilter,
    "ChoiceField": ChoiceFilter,
    "IntegerField": NumericFilter,
    "FloatField": NumericFilter,
    "DecimalField": NumericFilter,
    "BooleanField": BooleanFilter,
    "NullBooleanField": BooleanFilter,
    "TextField": ContainsFilter,
    "AutoField": NumericFilter,
    "BaseDynamicListSerializer": ForeignKeyFilter,
    "RelatedField": ForeignKeyFilter,
    "ManyRelatedField": ForeignKeyFilter,
}

DYNAMIC_LIST_FIELD_MAPPING = {
    "DateTimeField": (lambda: {
        "display": "datetime",
    }),
    "EmailField": (lambda: {
        "display": "link:mailto",
    }),
    "DateField": (lambda: {
        "display": "date",
    }),
    "TimeField": (lambda: {
        "display": "datetime",
    }),
    "CharField": (lambda: {
        "display": "verbatim",
    }),
    "UUIDField": (lambda: {
        "display": "verbatim",
    }),
    "ChoiceField": (lambda: {
        "display": "verbatim",
    }),
    "IntegerField": (lambda: {
        "display": "verbatim",
    }),
    "FloatField": (lambda: {
        "display": "verbatim",
    }),
    "DecimalField": (lambda: {
        "display": "verbatim",
    }),
    "BooleanField": (lambda: {
        "display": "boolean",
    }),
    "NullBooleanField": (lambda: {
        "display": "boolean",
    }),
    "TextField": (lambda: {
        "display": "verbatim",
    }),
    "AutoField": (lambda: {
        "display": "verbatim",
    }),
    "BaseDynamicListSerializer": (lambda: {
        "display": "verbatim",
        "foreign_key": True
    }),
    "ListSerializer": (lambda: {
        "display": "verbatim",
    }),
    "RelatedField": (lambda: {
        "display": "verbatim",
    }),
    "ManyRelatedField": (lambda: {
        "display": "verbatim",
    }),
}
DYNAMIC_LIST_SUPPORTED_FIELDS_TYPES = sorted(
    [
        fields.UUIDField,
        fields.DateTimeField,
        fields.DateField,
        fields.TimeField,
        fields.EmailField,
        fields.CharField,
        fields.UUIDField,
        fields.IntegerField,
        fields.FloatField,
        fields.DecimalField,
        fields.ChoiceField,
        fields.BooleanField,
        fields.NullBooleanField,
        # serializers.ListSerializer,
        serializers.RelatedField,
        serializers.ManyRelatedField,
    ],
    key=lambda x: len(x.mro()),
    reverse=True
)
