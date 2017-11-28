from rest_framework import status
from rest_framework.test import APITestCase

from cotidia.account import fixtures

from django.urls import reverse, resolve
from cotidia.admin.tests.models import GenericRecord
from django.contrib.contenttypes.models import ContentType


class AdminSearchDashboardTests(APITestCase):
    @fixtures.normal_user
    def setUp(self):
        pass

    def test_field_generation(self):
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_id = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse('dashboard', kwargs={"content_type_id": content_id})
        response = self.client.get(url)

        self.assertIn('choice_field', response.data['columns'].keys())
        self.assertIn('date_field', response.data['columns'].keys())
        self.assertIn('numeric_field', response.data['columns'].keys())
        self.assertIn('char_field', response.data['columns'].keys())
        self.assertIn('text_field', response.data['columns'].keys())

        self.assertEqual(response.data['endpoint'], url)


