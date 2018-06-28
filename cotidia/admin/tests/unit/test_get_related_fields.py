from collections import Counter

from rest_framework.test import APITestCase
from cotidia.admin.tests.serializers import ExampleModelOneSerializer
from cotidia.admin.tests.factory import ExampleModelTwoFactory


class TestFieldRepresentation(APITestCase):

    def test_get_related_fields_fields(self):
        serializer = ExampleModelOneSerializer()
        related_fields = serializer.get_related_fields()
        self.assertEqual(
            related_fields,
            ['other_model']
        )