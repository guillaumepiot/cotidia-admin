from rest_framework import serializers, fields

from cotidia.admin.filters import (
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
    reverse=True,
)

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
    "DateTimeField": (lambda: {"display": "datetime"}),
    "EmailField": (lambda: {"display": "link:mailto"}),
    "DateField": (lambda: {"display": "date"}),
    "TimeField": (lambda: {"display": "datetime"}),
    "CharField": (lambda: {"display": "verbatim"}),
    "UUIDField": (lambda: {"display": "verbatim"}),
    "ChoiceField": (lambda: {"display": "verbatim"}),
    "IntegerField": (lambda: {"display": "verbatim"}),
    "FloatField": (lambda: {"display": "verbatim"}),
    "DecimalField": (lambda: {"display": "verbatim"}),
    "BooleanField": (lambda: {"display": "boolean"}),
    "NullBooleanField": (lambda: {"display": "boolean"}),
    "TextField": (lambda: {"display": "verbatim"}),
    "AutoField": (lambda: {"display": "verbatim"}),
    "BaseDynamicListSerializer": (lambda: {"display": "verbatim", "foreign_key": True}),
    "ListSerializer": (lambda: {"display": "verbatim"}),
    "RelatedField": (lambda: {"display": "verbatim"}),
    "ManyRelatedField": (lambda: {"display": "verbatim"}),
    "SerializerMethodField": (lambda: {"display": "verbatim", "filter": "text"}),
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
    reverse=True,
)
