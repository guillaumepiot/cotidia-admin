from decimal import Decimal
from datetime import datetime

from django.urls import reverse

from rest_framework.test import APITestCase

from cotidia.account import fixtures
from cotidia.admin.tests.factory import (
    ExampleModelOneFactory,
    ExampleModelTwoFactory,
)


class AdminSearchDashboardTests(APITestCase):
    @fixtures.admin_user
    def setUp(self):
        self.url = reverse(
            'generic-api:object-list',
            kwargs={
                'app_label': 'tests',
                'model': 'examplemodelone',
            }
        )
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.admin_user_token.key
        )

    def test_getting_data_empty(self):
        response = self.client.get(self.url, {})

        self.assertEqual(response.data['count'], 0)
        self.assertEqual(response.data['next'], None)
        self.assertEqual(response.data['previous'], None)
        self.assertEqual(response.data['results'], [])

    def test_getting_data_fields_present(self):
        date_time = datetime.now()

        foreign_model = ExampleModelTwoFactory()
        test_model_1 = ExampleModelOneFactory(
            integer_field=1,
            integer_choice_field=2,
            float_field=10.0,
            decimal_field=Decimal('10'),
            boolean_field=True,
            nullboolean_field=False,
            char_field='demo',
            choice_field='foo',
            text_field='admin',
            slug_field='a-slug',
            date_field=date_time.date(),
            other_model=foreign_model,
        )
        test_model_1.many_to_many_field.add(foreign_model)

        response = self.client.get(self.url, {})

        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['next'], None)
        self.assertEqual(response.data['previous'], None)

        result = response.data['results'][0]

        self.assertEqual(result['integer_field'], 1)
        self.assertEqual(result['integer_choice_field'], 2)
        self.assertEqual(result['float_field'], 10.0)
        self.assertEqual(result['decimal_field'], '10.00')
        self.assertEqual(result['boolean_field'], True)
        self.assertEqual(result['nullboolean_field'], False)
        self.assertEqual(result['char_field'], 'demo')
        self.assertEqual(result['choice_field'], 'foo')
        self.assertEqual(result['text_field'], 'admin')
        self.assertEqual(result['slug_field'], 'a-slug')
        self.assertEqual(result['date_field'], str(date_time.date()))
        self.assertEqual(result['other_model__name'], foreign_model.name)
        self.assertEqual(result['other_model__number'], foreign_model.number)

    def test_integer_filters_equal(self):
        valid_data = {
            'integer_field': 1,
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        invalid_data = {
            'integer_field': 2,
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        ExampleModelOneFactory(**valid_data)
        ExampleModelOneFactory(**invalid_data)
        response = self.client.get(
            self.url + '?integer_field=1'
        )

        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['integer_field'], 1)

    def test_integer_filters_lte(self):
        valid_data = {
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        invalid_data = {
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        for i in range(10):
            ExampleModelOneFactory(integer_field=i, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(integer_field=i + 11, **invalid_data)

        response = self.client.get(self.url + '?integer_field=:10')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(result['integer_field'] <= 10)

    def test_integer_filters_gte(self):
        valid_data = {
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        invalid_data = {
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        for i in range(10):
            ExampleModelOneFactory(integer_field=i + 10, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(integer_field=i, **invalid_data)

        response = self.client.get(self.url + '?integer_field=10:')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(result['integer_field'] >= 10)

    def test_integer_filters_range(self):
        valid_data = {
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        invalid_data = {
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug',
        }

        for i in range(10):
            ExampleModelOneFactory(integer_field=i + 10, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(integer_field=i, **invalid_data)

        for i in range(10):
            ExampleModelOneFactory(integer_field=i + 21, **invalid_data)

        response = self.client.get(self.url + '?integer_field=10:20')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(result['integer_field'] >= 10)
            self.assertTrue(result['integer_field'] <= 20)

    def test_float_filters_equal(self):
        valid_data = {
            'integer_field': 1,
            'integer_choice_field': 2,
            'float_field': 1,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_field': 2,
            'integer_choice_field': 2,
            'float_field': 10.0,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        ExampleModelOneFactory(**valid_data)
        ExampleModelOneFactory(**invalid_data)

        response = self.client.get(self.url + '?integer_field=1')

        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['integer_field'], 1)

    def test_float_filters_lte(self):
        valid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        for i in range(10):
            ExampleModelOneFactory(float_field=i * 0.1, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(float_field=1 + i * 0.1, **invalid_data)

        response = self.client.get(self.url + '?float_field=:1')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(result['float_field'] <= 10)

    def test_float_filters_gte(self):
        valid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        for i in range(10):
            ExampleModelOneFactory(float_field=1 + i * 0.1, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(float_field=i * 0.1, **invalid_data)

        response = self.client.get(self.url + '?float_field=1:')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(result['float_field'] >= 1)

    def test_float_filters_range(self):
        valid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        for i in range(10):
            ExampleModelOneFactory(float_field=i * 0.1, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(float_field=1 + i * 0.1, **invalid_data)

        for i in range(10):
            ExampleModelOneFactory(float_field=2 + i * 0.1, **invalid_data)

        response = self.client.get(self.url + '?float_field=1:1.9')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(result['float_field'] >= 1)
            self.assertTrue(result['float_field'] <= 1.9)

    def test_decimal_filters_equal(self):
        valid_data = {
            'integer_field': 1,
            'integer_choice_field': 2,
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_field': 2,
            'integer_choice_field': 2,
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        ExampleModelOneFactory(**valid_data)
        ExampleModelOneFactory(**invalid_data)

        response = self.client.get(self.url + '?integer_field=1')

        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['integer_field'], 1)

    def test_decimal_filters_lte(self):
        valid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_choice_field': 2,
            'decimal_field': Decimal('10'),
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        for i in range(10):
            ExampleModelOneFactory(decimal_field=i * 0.1, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(decimal_field=1 + i * 0.1, **invalid_data)

        response = self.client.get(self.url + '?decimal_field=:1')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(Decimal(result['decimal_field']) <= 1)

    def test_decimal_filters_gte(self):
        valid_data = {
            'integer_choice_field': 2,
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_choice_field': 2,
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        for i in range(10):
            ExampleModelOneFactory(decimal_field=1 + i * 0.1, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(decimal_field=i * 0.1, **invalid_data)

        response = self.client.get(self.url + '?decimal_field=1:')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(Decimal(result['decimal_field']) >= 1)

    def test_decimal_filters_range(self):
        valid_data = {
            'integer_choice_field': 2,
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        invalid_data = {
            'integer_choice_field': 2,
            'boolean_field': True,
            'nullboolean_field': False,
            'char_field': 'demo',
            'choice_field': 'foo',
            'text_field': 'admin',
            'slug_field': 'a-slug'
        }

        for i in range(10):
            ExampleModelOneFactory(decimal_field=i * 0.1, **valid_data)

        for i in range(10):
            ExampleModelOneFactory(decimal_field=1 + i * 0.1, **invalid_data)

        for i in range(10):
            ExampleModelOneFactory(decimal_field=2 + i * 0.1, **invalid_data)

        response = self.client.get(self.url + '?decimal_field=1:1.9')

        self.assertEqual(response.data['count'], 10)

        for result in response.data['results']:
            self.assertTrue(Decimal(result['decimal_field']) >= Decimal(1))
            self.assertTrue(Decimal(result['decimal_field']) <= Decimal(2))

    def test_boolean_filter_true(self):
        ExampleModelOneFactory(boolean_field=True)
        ExampleModelOneFactory(boolean_field=False)

        response = self.client.get(self.url + '?boolean_field=true')

        self.assertEqual(response.data['count'], 1)
        self.assertTrue(response.data['results'][0]['boolean_field'])

    def test_boolean_filter_false(self):
        ExampleModelOneFactory(boolean_field=True)
        ExampleModelOneFactory(boolean_field=False)

        response = self.client.get(self.url + '?boolean_field=false')

        self.assertEqual(response.data['count'], 1)
        self.assertFalse(response.data['results'][0]['boolean_field'])

    def test_nullboolean_filter_true(self):
        ExampleModelOneFactory(nullboolean_field=True, boolean_field=True)
        ExampleModelOneFactory(nullboolean_field=False, boolean_field=True)
        ExampleModelOneFactory(nullboolean_field=None, boolean_field=True)

        response = self.client.get(self.url + '?nullboolean_field=true')

        self.assertEqual(response.data['count'], 1)
        self.assertTrue(response.data['results'][0]['nullboolean_field'])

    def test_nullboolean_filter_false(self):
        ExampleModelOneFactory(nullboolean_field=True, boolean_field=True)
        ExampleModelOneFactory(nullboolean_field=False, boolean_field=True)
        ExampleModelOneFactory(nullboolean_field=None, boolean_field=True)

        response = self.client.get(self.url + '?nullboolean_field=false')

        self.assertEqual(response.data['count'], 1)
        self.assertFalse(response.data['results'][0]['nullboolean_field'])

    def test_char_field_filter(self):
        ExampleModelOneFactory(char_field='Hooray', boolean_field=True)
        ExampleModelOneFactory(char_field='hoor', boolean_field=True)
        ExampleModelOneFactory(char_field='athoor', boolean_field=True)
        ExampleModelOneFactory(char_field='Stuff', boolean_field=True)

        response = self.client.get(self.url + '?char_field=hoor')

        self.assertEqual(response.data['count'], 3)

    def test_text_field_filter(self):
        ExampleModelOneFactory(text_field='hooray', boolean_field=True)
        ExampleModelOneFactory(text_field='hoor', boolean_field=True)
        ExampleModelOneFactory(text_field='athoor', boolean_field=True)
        ExampleModelOneFactory(text_field='stuff', boolean_field=True)

        response = self.client.get(self.url + '?text_field=hoor')

        self.assertEqual(response.data['count'], 3)

    def test_slug_field_filter(self):
        ExampleModelOneFactory(slug_field='Hooray', boolean_field=True)
        ExampleModelOneFactory(slug_field='hoor', boolean_field=True)
        ExampleModelOneFactory(slug_field='athoor', boolean_field=True)
        ExampleModelOneFactory(slug_field='Stuff', boolean_field=True)

        response = self.client.get(self.url + '?slug_field=hoor')

        self.assertEqual(response.data['count'], 3)

    def test_foreign_key_field_filtering(self):
        em2 = ExampleModelTwoFactory()

        ExampleModelOneFactory(other_model=em2, boolean_field=True)
        ExampleModelOneFactory(boolean_field=True)

        response = self.client.get(self.url + '?other_model=' + str(em2.uuid))

        self.assertEqual(response.data['count'], 1)

    def test_many_to_many_field_filtering(self):
        em2 = ExampleModelTwoFactory(name='Test Item')

        valid_model = ExampleModelOneFactory(
            other_model=em2,
            boolean_field=True
        )

        ExampleModelOneFactory(boolean_field=True)

        valid_model.many_to_many_field.add(em2)

        response = self.client.get(
            self.url + '?many_to_many_field=' + str(em2.uuid)
        )

        self.assertEqual(response.data['count'], 1)
        self.assertEqual(
            response.data['results'][0]['many_to_many_field'],
            ['Test Item']
        )
