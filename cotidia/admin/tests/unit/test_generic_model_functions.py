from rest_framework.test import APITestCase

from django.urls import reverse
from django.contrib.contenttypes.models import ContentType

from cotidia.admin.tests.models import GenericRecord, GenericRecordNoMeta
from cotidia.admin.utils import get_model_structure
from cotidia.account import fixtures
from cotidia.admin.tests.factory import GenericRecordFactory
from django.conf import settings


class AdminSearchDashboardTests(APITestCase):
    @fixtures.normal_user
    def setUp(self):
        pass

    def test_field_generation(self):
        url = "temp_url"
        data = get_model_structure(GenericRecord, url)

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

        # Check meta data fields were correctly labelled
        self.assertEqual("Choice Field", data['columns']['choice_field']['label'])
        self.assertEqual("Date Field", data['columns']['date_field']['label'])

        # Check non-meta data fields were correctly labelled
        self.assertEqual("numeric_field", data['columns']['numeric_field']['label'])
        self.assertEqual("char_field", data['columns']['char_field']['label'])
        self.assertEqual("text_field", data['columns']['text_field']['label'])


        self.assertEqual(data['endpoint'], url)
        
    def test_field_generation_no_metadata(self):
        url = "temp_url"
        data = get_model_structure(GenericRecordNoMeta, url)

        # Check all fields present
        self.assertIn('choice_field', data['columns'].keys())
        self.assertIn('choice_field', data['columns'].keys())
        self.assertIn('date_field', data['columns'].keys())
        self.assertIn('numeric_field', data['columns'].keys())
        self.assertIn('char_field', data['columns'].keys())
        self.assertIn('text_field', data['columns'].keys())

        # Check filter type was correctly assigned
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

        # Check fields were correctly labelled
        self.assertEqual("choice_field", data['columns']['choice_field']['label'])
        self.assertEqual("date_field", data['columns']['date_field']['label'])
        self.assertEqual("numeric_field", data['columns']['numeric_field']['label'])
        self.assertEqual("char_field", data['columns']['char_field']['label'])
        self.assertEqual("text_field", data['columns']['text_field']['label'])

        self.assertEqual(data['endpoint'], url)

    def test_getting_data_no_filters(self):
        GenericRecordFactory(numeric_field=99)
        GenericRecordFactory(numeric_field=101)
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {}
        response = self.client.get(url, data) 
        self.assertEqual(2, response.data['count'])

    def test_getting_data_char_filter(self):
        # Creates elements that we are going to test on
        GenericRecordFactory(id=1, char_field="hello_world")
        GenericRecordFactory(id=2, char_field="the whole world")
        GenericRecordFactory(id=3, char_field="nothing")
        GenericRecordFactory(id=4, char_field="Worldwide")

        # Create junk objects that match the filter to ensure we have more than
        # 1 page
        for i in range(10):
            GenericRecordFactory(char_field="world")

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"char_field": "world"}
        response = self.client.get(url, data)
        self.assertEqual(13, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("?char_field=world", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(1, [x['id'] for x in response.data['results']])
        self.assertIn(2, [x['id'] for x in response.data['results']])
        self.assertIn(4, [x['id'] for x in response.data['results']])

        # Checks the id that did not match the filter is not included
        self.assertNotIn(3, [x['id'] for x in response.data['results']])

    def test_getting_data_text_filter(self):
        # Creates elements that we are going to test on
        GenericRecordFactory(id=1, text_field="hello_world")
        GenericRecordFactory(id=2, text_field="the whole world")
        GenericRecordFactory(id=3, text_field="nothing")
        GenericRecordFactory(id=4, text_field="Worldwide")

        # Create junk objects that match the filter to ensure we have more than
        # 1 page
        for i in range(10):
            GenericRecordFactory(text_field="world")

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"text_field": "world"}
        response = self.client.get(url, data)
        self.assertEqual(13, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("text_field=world", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(1, [x['id'] for x in response.data['results']])
        self.assertIn(2, [x['id'] for x in response.data['results']])
        self.assertIn(4, [x['id'] for x in response.data['results']])

        # Checks the id that did not match the filter is not included
        self.assertNotIn(3, [x['id'] for x in response.data['results']])

    def test_getting_data_boolean_filter(self):
        # Creates elements that we are going to test on
        GenericRecordFactory(id=1, boolean_field=True)
        GenericRecordFactory(id=2, boolean_field=False)
        GenericRecordFactory(id=3, boolean_field=True)

        # Create junk objects that match the filter to ensure we have more than
        # 1 page
        for i in range(10):
            GenericRecordFactory(boolean_field=True)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"boolean_field": True}
        response = self.client.get(url, data)
        self.assertEqual(12, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("boolean_field=True", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(1, [x['id'] for x in response.data['results']])
        self.assertIn(3, [x['id'] for x in response.data['results']])

        # Checks the id that did not match the filter is not included
        self.assertNotIn(2, [x['id'] for x in response.data['results']])


    def test_getting_data_choice_filter(self):
        # Creates elements that we are going to test on
        GenericRecordFactory(id=1, choice_field="opt1")
        GenericRecordFactory(id=2, choice_field="opt2")
        GenericRecordFactory(id=3, choice_field="opt1")

        # Create junk objects that match the filter to ensure we have more than
        # 1 page
        for i in range(10):
            GenericRecordFactory(choice_field="opt1")

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"choice_field": "opt1"}
        response = self.client.get(url, data)
        self.assertEqual(12, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("choice_field=opt1", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(1, [x['id'] for x in response.data['results']])
        self.assertIn(3, [x['id'] for x in response.data['results']])

        # Checks the id that did not match the filter is not included
        self.assertNotIn(2, [x['id'] for x in response.data['results']])


    def test_getting_data_numeric_filter_equal(self):
        # Creates elements that we are going to test on
        for i in range(1, 8):
            GenericRecordFactory(id=i, numeric_field=i)

        for i in range(10):
            GenericRecordFactory(numeric_field=7)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"numeric_field": "7"}
        response = self.client.get(url, data)

        self.assertEqual(11, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("numeric_field=7", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])
        
        for x in response.data['results']:
            self.assertEqual(7, x['numeric_field'])

    def test_getting_data_numeric_filter_lte(self):
        # Creates elements that we are going to test on
        for i in range(1, 21):
            GenericRecordFactory(id=i, numeric_field=i)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"numeric_field": ":11"}
        response = self.client.get(url, data)

        self.assertEqual(11, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("numeric_field=%3A11", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])
        
        for x in response.data['results']:
            self.assertTrue(x['numeric_field'] <= 11)

    def test_getting_data_numeric_filter_gte(self):
        # Creates elements that we are going to test on
        for i in range(1, 21):
            GenericRecordFactory(id=i, numeric_field=i)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"numeric_field": "9:"}
        response = self.client.get(url, data)

        self.assertEqual(12, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("numeric_field=9%3A", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(10, [x['id'] for x in response.data['results']])
        
        for x in response.data['results']:
            self.assertTrue(x['numeric_field'] >= 9)

    def test_getting_data_numeric_filter_range(self):
        # Creates elements that we are going to test on
        for i in range(1, 101):
            GenericRecordFactory(id=i, numeric_field=i)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        data = {"numeric_field": "10:25"}
        response = self.client.get(url, data)

        self.assertEqual(16, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        self.assertIn("numeric_field=10%3A25", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(10, [x['id'] for x in response.data['results']])
        
        for x in response.data['results']:
            self.assertTrue(x['numeric_field'] >= 10 and x['numeric_field'] <=25)
