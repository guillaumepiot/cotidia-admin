from rest_framework.test import APITestCase

from cotidia.admin.serializers import AdminModelSerializer

from cotidia.admin.tests.serializers import ExampleModelOneSerializer
from cotidia.admin.tests.factory import ExampleModelTwoFactory
from cotidia.admin.tests.models import ExampleModelOne


class TestSerializer1(AdminModelSerializer):
    class Meta:
        model = ExampleModelOne

    class SearchProvider:
        default_columns = [
            'integer_field',
            'float_field',
            'decimal_field',
            'char_field'
        ]


class TestSerializer2(AdminModelSerializer):
    class Meta:
        model = ExampleModelOne


class TestSerializer3(AdminModelSerializer):
    class Meta:
        model = ExampleModelOne
    
    class SearchProvider:
        display_field = "name"


class TestSerializer4(AdminModelSerializer):
    class Meta:
        model = ExampleModelOne
    
    class SearchProvider:
        display_field = None


class FieldRepresentation(APITestCase):

    def test_custom_default_fields(self):
        serializer = TestSerializer1()
        default_fields = serializer.get_default_columns()
        self.assertEqual(
            default_fields,
            ['integer_field', 'float_field', 'decimal_field', 'char_field']
        )

    def test_no_search_provider_fields(self):
        serializer = TestSerializer2()
        default_fields = serializer.get_default_columns()
        self.assertEqual(
            default_fields, ["id"]
        )

    def test_default_fields_display_name(self):
        serializer = TestSerializer3()
        default_fields = serializer.get_default_columns()
        self.assertEqual(
            default_fields, ['name']
        )

    def test_default_fields_display_name_is_none(self):
        serializer = TestSerializer4()
        default_fields = serializer.get_default_columns()
        self.assertEqual(
            default_fields, ['id']
        )