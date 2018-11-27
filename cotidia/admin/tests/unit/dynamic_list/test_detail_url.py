from django.test import TestCase

from cotidia.admin.tests.models import ExampleModelOne
from cotidia.admin.serializers import BaseDynamicListSerializer


class TestDetailURLSerializer(TestCase):
    def test_detail_url_none(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelOne()

            class Meta:
                model = ExampleModelOne
                fields = "__all__"

            class SearchProvider:
                display_field = "char_field"
                filters = "__all__"
                detail_url_field = None

        serializer = ExampleModelOneSerializer()
        self.assertEqual(serializer.get_detail_url_field(), None)

    def test_detail_url_default(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelOne()

            class Meta:
                model = ExampleModelOne
                fields = "__all__"

            class SearchProvider:
                display_field = "char_field"
                filters = "__all__"

        serializer = ExampleModelOneSerializer()
        self.assertEqual(serializer.get_detail_url_field(), "_detail_url")

    def test_detail_url_custom(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelOne()

            class Meta:
                model = ExampleModelOne
                fields = "__all__"

            class SearchProvider:
                display_field = "char_field"
                filters = "__all__"
                detail_url_field = "detail_url"

        serializer = ExampleModelOneSerializer()
        self.assertEqual(serializer.get_detail_url_field(), "detail_url")
