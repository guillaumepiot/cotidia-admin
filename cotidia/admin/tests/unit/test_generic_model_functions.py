from datetime import timedelta, datetime
from rest_framework.test import APITestCase

from django.urls import reverse
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType

from cotidia.admin.tests.models import GenericRecord, GenericRecordNoMeta
from cotidia.admin.utils import get_model_structure
from cotidia.account import fixtures
from cotidia.admin.tests.factory import GenericRecordFactory
from django.conf import settings


class AdminSearchDashboardTests(APITestCase):
    @fixtures.admin_user
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

        self.assertIn('foreign_key_field__choice_field', data['columns'].keys())
        self.assertIn('foreign_key_field__choice_field', data['columns'].keys())
        self.assertIn('foreign_key_field__date_field', data['columns'].keys())
        self.assertIn('foreign_key_field__numeric_field', data['columns'].keys())
        self.assertIn('foreign_key_field__char_field', data['columns'].keys())
        self.assertIn('foreign_key_field__text_field', data['columns'].keys())

        self.assertEqual('number', data['columns']['id']['filter'])
        self.assertEqual('choice', data['columns']['choice_field']['filter'])
        self.assertEqual('date', data['columns']['date_field']['filter'])
        self.assertEqual('number', data['columns']['numeric_field']['filter'])
        self.assertEqual('text', data['columns']['char_field']['filter'])
        self.assertEqual('text', data['columns']['text_field']['filter'])
        self.assertEqual('number', data['columns']['foreign_key_field__id']['filter'])
        self.assertEqual('choice', data['columns']['foreign_key_field__choice_field']['filter'])
        self.assertEqual('date', data['columns']['foreign_key_field__date_field']['filter'])
        self.assertEqual('number', data['columns']['foreign_key_field__numeric_field']['filter'])
        self.assertEqual('text', data['columns']['foreign_key_field__char_field']['filter'])
        self.assertEqual('text', data['columns']['foreign_key_field__text_field']['filter'])
        self.assertEqual([
            {"value": "opt1", "label": "Option 1"},
            {"value": "opt2", "label": "Option 2"},
            {"value": "opt3", "label": "Option 3"}
            ], data['columns']['choice_field']['options'])

        # Check meta data fields were correctly labelled
        self.assertEqual("TEST_LABEL", data['columns']['choice_field']['label'])
        self.assertEqual("TEST_LABEL2", data['columns']['date_field']['label'])
        self.assertEqual("replacement_label", data['columns']['foreign_key_field__choice_field']['label'])

        # Check non-meta data fields were correctly labelled
        self.assertEqual("Numeric Field", data['columns']['numeric_field']['label'])
        self.assertEqual("Char Field", data['columns']['char_field']['label'])
        self.assertEqual("Text Field", data['columns']['text_field']['label'])

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
        self.assertEqual([
            {"value": "opt1", "label": "Option 1"},
            {"value": "opt2", "label": "Option 2"},
            {"value": "opt3", "label": "Option 3"}
            ], data['columns']['choice_field']['options'])

        # Check fields were correctly labelled
        self.assertEqual("Choice Field", data['columns']['choice_field']['label'])
        self.assertEqual("Date Field", data['columns']['date_field']['label'])
        self.assertEqual("Numeric Field", data['columns']['numeric_field']['label'])
        self.assertEqual("Char Field", data['columns']['char_field']['label'])
        self.assertEqual("Text Field", data['columns']['text_field']['label'])

        self.assertEqual(data['endpoint'], url)

    def test_getting_data_no_filters(self):
        GenericRecordFactory(numeric_field=99)
        GenericRecordFactory(numeric_field=101)
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
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
        for i in range(20):
            GenericRecordFactory(char_field="world")

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"char_field": "world"}
        response = self.client.get(url, data)
        self.assertEqual(23, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("?char_field=world", response.data['next'])

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
        for i in range(20):
            GenericRecordFactory(text_field="world")

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"text_field": "world"}
        response = self.client.get(url, data)
        self.assertEqual(23, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("text_field=world", response.data['next'])

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
        for i in range(20):
            GenericRecordFactory(boolean_field=True)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"boolean_field": "true"}
        response = self.client.get(url, data)
        self.assertEqual(22, response.data['count'])

#         Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("boolean_field=True", response.data['next'])

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
        for i in range(20):
            GenericRecordFactory(choice_field="opt1")

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"choice_field": "opt1"}
        response = self.client.get(url, data)
        self.assertEqual(22, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("choice_field=opt1", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(1, [x['id'] for x in response.data['results']])
        self.assertIn(3, [x['id'] for x in response.data['results']])

        # Checks the id that did not match the filter is not included
        self.assertNotIn(2, [x['id'] for x in response.data['results']])

    def test_getting_data_numeric_filter_equal(self):
        # Creates elements that we are going to test on
        for i in range(1, 8):
            GenericRecordFactory(id=i, numeric_field=i)

        for i in range(20):
            GenericRecordFactory(numeric_field=7)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"numeric_field": "7"}
        response = self.client.get(url, data)

        self.assertEqual(21, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=7", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertEqual(7, x['numeric_field'])

    def test_getting_data_numeric_filter_lte(self):
        # Creates elements that we are going to test on
        for i in range(1, 21):
            GenericRecordFactory(id=i, numeric_field=i)

        for i in range(10):
            GenericRecordFactory(numeric_field=1)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"numeric_field": ":11"}
        response = self.client.get(url, data)

        self.assertEqual(21, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=%3A11", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertTrue(x['numeric_field'] <= 11)

    def test_getting_data_numeric_filter_gte(self):
        # Creates elements that we are going to test on
        for i in range(1, 21):
            GenericRecordFactory(id=i, numeric_field=i)

        for i in range(10):
            GenericRecordFactory(numeric_field=10)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"numeric_field": "9:"}
        response = self.client.get(url, data)

        self.assertEqual(22, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=9%3A", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(10, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertTrue(x['numeric_field'] >= 9)

    def test_getting_data_numeric_filter_range(self):
        # Creates elements that we are going to test on
        for i in range(1, 101):
            GenericRecordFactory(id=i, numeric_field=i)

        for i in range(10):
            GenericRecordFactory(numeric_field=15)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"numeric_field": "10:25"}
        response = self.client.get(url, data)

        self.assertEqual(26, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=10%3A25", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(10, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertTrue(x['numeric_field'] >= 10 and x['numeric_field'] <=25)


    def test_getting_data_date_filter_equal(self):
        # Creates elements that we are going to test on
        tz = timezone.now().date()
        tz2 = timezone.now().date() + timedelta(days=2)
        for i in range(1, 8):
            GenericRecordFactory(id=i, date_field=tz)

        for i in range(20):
            GenericRecordFactory(date_field=tz2)

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"date_field":  tz.strftime("%Y-%m-%d")}
        response = self.client.get(url, data)

        self.assertEqual(7, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=7", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertEqual(tz.strftime("%Y-%m-%d"), x['date_field'])

    def test_getting_data_date_filter_lte(self):
        tz = timezone.now().date()
        # Creates elements that we are going to test on
        for i in range(1, 21):
            GenericRecordFactory(id=i, date_field=tz - timedelta(days=i))

        for i in range(10):
            GenericRecordFactory(date_field=tz + timedelta(days=i))

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"date_field": ":%s" % tz.strftime("%Y-%m-%d")}
        response = self.client.get(url, data)
        self.assertEqual(21, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=%3A11", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertTrue(
                datetime.strptime(x['date_field'], "%Y-%m-%d").date() <= tz
            )

    def test_getting_data_date_filter_gte(self):
        tz = timezone.now().date()
        # Creates elements that we are going to test on
        for i in range(1, 21):
            GenericRecordFactory(id=i, date_field=tz + timedelta(days=i))

        for i in range(10):
            GenericRecordFactory(date_field=tz - timedelta(days=i))

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"date_field": "%s:" % tz.strftime("%Y-%m-%d")}
        response = self.client.get(url, data)

        self.assertEqual(21, response.data['count'])

        # Checks the filter text is in the "next" link in the pagination object
        # self.assertIn("numeric_field=%3A11", response.data['next'])

        # Checks the ids that matched the filter are included 
        self.assertIn(7, [x['id'] for x in response.data['results']])

        for x in response.data['results']:
            self.assertTrue(datetime.strptime(x['date_field'],
                                              '%Y-%m-%d').date() >= tz)

    def test_getting_data_date_filter_range(self):
        tz = timezone.now().date()
        # Creates elements that we are going to test on
        tz = timezone.now().date()
        tz1 = tz + timedelta(days=11)
        tz2 = tz + timedelta(days=20)
        for i in range(1, 31):
            GenericRecordFactory(id=i, date_field=tz + timedelta(days=i))

        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord)
        url = reverse("generic-api:object-list", kwargs={"app_label": content_type.app_label, "model": content_type.model})
        data = {"date_field": "%s:%s" % (tz1.strftime("%Y-%m-%d"), tz2.strftime("%Y-%m-%d"))}
        response = self.client.get(url, data)

        self.assertEqual(10, response.data['count'])

        for x in response.data['results']:
            self.assertTrue(datetime.strptime(x['date_field'],
                                              '%Y-%m-%d').date() >= tz1)
            self.assertTrue(datetime.strptime(x['date_field'],
                                              '%Y-%m-%d').date() <= tz2)
