from cotidia.admin.serializers import AdminModelSerializer

from cotidia.admin.tests.models import (
    ExampleModelOne,
    ExampleModelTwo,
    DeclaredSerializerModel
)


class ExampleModelTwoSerializer(AdminModelSerializer):
    class Meta:
        model = ExampleModelTwo
        exclude = [
            "uuid",
            "other_model"
        ]

    class SearchProvider:
        display_field = "name"


class ExampleModelOneSerializer(AdminModelSerializer):
    other_model = ExampleModelTwoSerializer()
    many_to_many_field = ExampleModelTwoSerializer(many=True)

    class Meta:
        model = ExampleModelOne
        exclude = [
            "uuid",
            "duration_field",
        ]

    class SearchProvider:
        display_field = "char_field"


class DeclaredModelSerializer(AdminModelSerializer):

    class Meta:
        model = DeclaredSerializerModel
