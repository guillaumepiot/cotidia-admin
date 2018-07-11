from django.test import TestCase

from cotidia.admin.tests.models import (
    AutoSerializerModel,
    DeclaredSerializerModel
)
from cotidia.admin.tests.serializers import DeclaredModelSerializer


class ModelUnitTests(TestCase):

    def test_get_serializer_auto(self):
        """If we don't have an admin serializer, create one on the fly."""
        s = AutoSerializerModel.get_admin_serializer()
        self.assertEqual(s.__class__.__name__, 'SerializerMetaclass')

    def test_get_serializer_declared(self):
        """Retrieve the specified serializer."""
        s = DeclaredSerializerModel.get_admin_serializer()
        self.assertEqual(s, DeclaredModelSerializer)
