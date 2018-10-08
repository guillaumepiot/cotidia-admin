from django.test import TestCase

from cotidia.admin.tests.models import ExampleModelOne, ExampleModelTwo
from cotidia.admin.serializers import BaseDynamicListSerializer

class ExampleModelTwoSerializer(BaseDynamicListSerializer):
    class Meta:
        model = ExampleModelTwo
        exclude = ["uuid", "other_model"]

    class SearchProvider:
        display_field = "name"
        filters = '__all__'

class TestGetNestedSerializer(TestCase):
    def test_no_nested_fields(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            class Meta:
                model = ExampleModelOne
                fields = ["uuid", "char_field"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field"]
                filters = '__all__'
        
        serializer = ExampleModelOneSerializer()
        self.assertEqual(serializer.get_nested_serializers(), [])

    def test_nested_fields(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelTwoSerializer()
            class Meta:
                model = ExampleModelOne
                fields = ["uuid", "char_field", "other_model"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field"]
                filters = '__all__'
        
        serializer = ExampleModelOneSerializer()
        self.assertEqual(serializer.get_nested_serializers(), ['other_model'])
