from rest_framework import serializers

from cotidia.admin.serializers import AdminModelSerializer

from cotidia.admin.tests.models import (
    ExampleModelOne,
    ExampleModelTwo,
    DeclaredSerializerModel
)


class ExampleModelTwoSerializer(AdminModelSerializer):
    class Meta:
        model = ExampleModelTwo

        exclude = ["uuid", "other_model"]

    class SearchProvider:
        display_field = "name"


class ExampleModelOneSerializer(AdminModelSerializer):
    other_model = ExampleModelTwoSerializer()

    many_to_many_field = ExampleModelTwoSerializer(many=True)
    unfilterable_property = serializers.CharField()

    class Meta:
        model = ExampleModelOne

        exclude = ["uuid", "duration_field"]

    class SearchProvider:
        display_field = "char_field"
        general_query_fields = ["char_field", "text_field", "slug_field"]


class DeclaredModelSerializer(AdminModelSerializer):
    class Meta:
        model = DeclaredSerializerModel


class CustomSerializer(AdminModelSerializer):
    class Meta:
        model = ExampleModelTwo
        exclude = ["uuid"]

    class SearchProvider:
        display_field = "number"


class CustomColumnChildSerializer(AdminModelSerializer):

    class Meta:
        model = ExampleModelTwo

    class SearchProvider:
        display_field = "char_field"
        columns = [
            {
                "label": "Number",
                "columns": [
                    'number',
                ]
            }
        ]


class CustomColumnSerializer(AdminModelSerializer):
    other_model = CustomColumnChildSerializer()

    class Meta:
        model = ExampleModelOne
        exclude = ["uuid", "duration_field"]

    class SearchProvider:
        display_field = "char_field"
        columns = [
            {
                "label": "Other model",
                "columns": [
                    'other_model',
                    'other_model__number',
                    'other_model__name',
                ]
            },
            {
                "label": "Model one",
                "columns": [
                    'integer_field',
                    'boolean_field',
                ]
            }
        ]
