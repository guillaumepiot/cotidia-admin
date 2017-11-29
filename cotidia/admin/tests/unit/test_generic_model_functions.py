

from rest_framework import status
from rest_framework.test import APITestCase

from cotidia.account import fixtures

from django.urls import reverse, resolve
from django.contrib.contenttypes.models import ContentType

from cotidia.admin.tests.models import GenericRecord
from cotidia.admin.utils import get_model_structure


class AdminSearchDashboardTests(APITestCase):
    @fixtures.normal_user
    def setUp(self):
        pass

    def test_field_generation(self):
        url = "temp_url"
        data = get_model_structure(GenericRecord, url)
        pp = pprint.PrettyPrinter(indent=4)
        pp.pprint(data)

        self.assertIn('choice_field', data['columns'].keys())
        self.assertIn('choice_field', data['columns'].keys())
        self.assertIn('date_field', data['columns'].keys())
        self.assertIn('numeric_field', data['columns'].keys())
        self.assertIn('char_field', data['columns'].keys())
        self.assertIn('text_field', data['columns'].keys())

        self.assertEqual('number', data['columns']['id']['filter'])
        self.assertEqual('choice', data['columns']['choice_field']['filter'])
        self.assertEqual('date', data['columns']['date_field']['filter'])
        self.assertEqual('number', data['columns']['numeric_field']['filter'])
        self.assertEqual('text', data['columns']['char_field']['filter'])
        self.assertEqual('text', data['columns']['text_field']['filter'])

        self.assertEqual((
                    ("opt1", "Option 1"),
                    ("opt2", "Option 2"),
                    ("opt3", "Option 3")
                    ), data['columns']['choice_field']['options'])


        self.assertEqual(data['endpoint'], url)
