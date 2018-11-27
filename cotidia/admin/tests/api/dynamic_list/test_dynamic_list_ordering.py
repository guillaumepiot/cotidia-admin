from decimal import Decimal
from datetime import datetime

from django.urls import reverse
from rest_framework.test import APITestCase
from cotidia.account import fixtures
from cotidia.admin.tests.factory import ExampleModelOneFactory, ExampleModelTwoFactory


class AdminSearchDashboardTests(APITestCase):
    @fixtures.admin_user
    def setUp(self):
        self.url = reverse("dynamic-api:exampleone-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.admin_user_token.key)

    def test_ordering_empty(self):
        response = self.client.get(self.url, {"_order": ""})

        self.assertEqual(response.data["total_result_count"], 0)
        self.assertEqual(response.data["next"], None)
        self.assertEqual(response.data["previous"], None)
        self.assertEqual(response.data["results"], [])

    def test_ordering_integer_field(self):
        ExampleModelOneFactory.create(integer_field=4)
        ExampleModelOneFactory.create(integer_field=5)
        ExampleModelOneFactory.create(integer_field=3)
        ExampleModelOneFactory.create(integer_field=1)
        ExampleModelOneFactory.create(integer_field=2)

        response = self.client.get(self.url, {"_order": "integer_field"})

        self.assertEqual(response.data["total_result_count"], 5)
        self.assertEqual(response.data["results"][0]["integer_field"], 1)
        self.assertEqual(response.data["results"][1]["integer_field"], 2)
        self.assertEqual(response.data["results"][2]["integer_field"], 3)
        self.assertEqual(response.data["results"][3]["integer_field"], 4)
        self.assertEqual(response.data["results"][4]["integer_field"], 5)

    def test_ordering_integer_field_desc(self):
        ExampleModelOneFactory.create(integer_field=4)
        ExampleModelOneFactory.create(integer_field=5)
        ExampleModelOneFactory.create(integer_field=3)
        ExampleModelOneFactory.create(integer_field=1)
        ExampleModelOneFactory.create(integer_field=2)

        response = self.client.get(self.url, {"_order": "-integer_field"})

        self.assertEqual(response.data["total_result_count"], 5)
        self.assertEqual(response.data["results"][0]["integer_field"], 5)
        self.assertEqual(response.data["results"][1]["integer_field"], 4)
        self.assertEqual(response.data["results"][2]["integer_field"], 3)
        self.assertEqual(response.data["results"][3]["integer_field"], 2)
        self.assertEqual(response.data["results"][4]["integer_field"], 1)

    def test_ordering_float_field(self):
        ExampleModelOneFactory.create(float_field=1.4)
        ExampleModelOneFactory.create(float_field=1.5)
        ExampleModelOneFactory.create(float_field=1.3)
        ExampleModelOneFactory.create(float_field=1.1)
        ExampleModelOneFactory.create(float_field=1.2)

        response = self.client.get(self.url, {"_order": "float_field"})

        self.assertEqual(response.data["total_result_count"], 5)

        self.assertEqual(response.data["results"][0]["float_field"], 1.1)
        self.assertEqual(response.data["results"][1]["float_field"], 1.2)
        self.assertEqual(response.data["results"][2]["float_field"], 1.3)
        self.assertEqual(response.data["results"][3]["float_field"], 1.4)
        self.assertEqual(response.data["results"][4]["float_field"], 1.5)

    def test_ordering_float_field_desc(self):
        ExampleModelOneFactory.create(float_field=1.4)
        ExampleModelOneFactory.create(float_field=1.5)
        ExampleModelOneFactory.create(float_field=1.3)
        ExampleModelOneFactory.create(float_field=1.1)
        ExampleModelOneFactory.create(float_field=1.2)

        response = self.client.get(self.url, {"_order": "-float_field"})

        self.assertEqual(response.data["total_result_count"], 5)

        self.assertEqual(response.data["results"][4]["float_field"], 1.1)
        self.assertEqual(response.data["results"][3]["float_field"], 1.2)
        self.assertEqual(response.data["results"][2]["float_field"], 1.3)
        self.assertEqual(response.data["results"][1]["float_field"], 1.4)
        self.assertEqual(response.data["results"][0]["float_field"], 1.5)

    def test_ordering_decimal_field(self):
        ExampleModelOneFactory.create(decimal_field=Decimal("1.4"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.5"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.3"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.1"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.2"))

        response = self.client.get(self.url, {"_order": "decimal_field"})

        self.assertEqual(response.data["total_result_count"], 5)

        self.assertEqual(response.data["results"][0]["decimal_field"], "1.10")
        self.assertEqual(response.data["results"][1]["decimal_field"], "1.20")
        self.assertEqual(response.data["results"][2]["decimal_field"], "1.30")
        self.assertEqual(response.data["results"][3]["decimal_field"], "1.40")
        self.assertEqual(response.data["results"][4]["decimal_field"], "1.50")

    def test_ordering_decimal_field_desc(self):
        ExampleModelOneFactory.create(decimal_field=Decimal("1.4"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.5"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.3"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.1"))
        ExampleModelOneFactory.create(decimal_field=Decimal("1.2"))

        response = self.client.get(self.url, {"_order": "-decimal_field"})

        self.assertEqual(response.data["total_result_count"], 5)

        self.assertEqual(response.data["results"][4]["decimal_field"], "1.10")
        self.assertEqual(response.data["results"][3]["decimal_field"], "1.20")
        self.assertEqual(response.data["results"][2]["decimal_field"], "1.30")
        self.assertEqual(response.data["results"][1]["decimal_field"], "1.40")
        self.assertEqual(response.data["results"][0]["decimal_field"], "1.50")

    def test_ordering_boolean_field(self):
        ExampleModelOneFactory.create(boolean_field=True)
        ExampleModelOneFactory.create(boolean_field=False)
        ExampleModelOneFactory.create(boolean_field=True)
        ExampleModelOneFactory.create(boolean_field=False)
        ExampleModelOneFactory.create(boolean_field=True)

        response = self.client.get(self.url, {"_order": "boolean_field"})

        self.assertEqual(response.data["results"][0]["boolean_field"], False)
        self.assertEqual(response.data["results"][1]["boolean_field"], False)
        self.assertEqual(response.data["results"][2]["boolean_field"], True)
        self.assertEqual(response.data["results"][3]["boolean_field"], True)
        self.assertEqual(response.data["results"][4]["boolean_field"], True)

    def test_ordering_boolean_field_desc(self):
        ExampleModelOneFactory.create(boolean_field=True)
        ExampleModelOneFactory.create(boolean_field=False)
        ExampleModelOneFactory.create(boolean_field=True)
        ExampleModelOneFactory.create(boolean_field=False)
        ExampleModelOneFactory.create(boolean_field=True)

        response = self.client.get(self.url, {"_order": "-boolean_field"})

        self.assertEqual(response.data["results"][4]["boolean_field"], False)
        self.assertEqual(response.data["results"][3]["boolean_field"], False)
        self.assertEqual(response.data["results"][2]["boolean_field"], True)
        self.assertEqual(response.data["results"][1]["boolean_field"], True)
        self.assertEqual(response.data["results"][0]["boolean_field"], True)

    def test_ordering_nullboolean_field(self):
        ExampleModelOneFactory.create(nullboolean_field=True)
        ExampleModelOneFactory.create(nullboolean_field=False)
        ExampleModelOneFactory.create(nullboolean_field=True)
        ExampleModelOneFactory.create(nullboolean_field=None)
        ExampleModelOneFactory.create(nullboolean_field=False)
        ExampleModelOneFactory.create(nullboolean_field=None)

        response = self.client.get(self.url, {"_order": "nullboolean_field"})

        self.assertEqual(response.data["results"][0]["nullboolean_field"], False)
        self.assertEqual(response.data["results"][1]["nullboolean_field"], False)
        self.assertEqual(response.data["results"][2]["nullboolean_field"], True)
        self.assertEqual(response.data["results"][3]["nullboolean_field"], True)
        self.assertEqual(response.data["results"][4]["nullboolean_field"], None)
        self.assertEqual(response.data["results"][5]["nullboolean_field"], None)

    def test_ordering_null_boolean_field_desc(self):
        ExampleModelOneFactory.create(nullboolean_field=True)
        ExampleModelOneFactory.create(nullboolean_field=False)
        ExampleModelOneFactory.create(nullboolean_field=True)
        ExampleModelOneFactory.create(nullboolean_field=None)
        ExampleModelOneFactory.create(nullboolean_field=False)
        ExampleModelOneFactory.create(nullboolean_field=None)

        response = self.client.get(self.url, {"_order": "-nullboolean_field"})

        self.assertEqual(response.data["results"][3]["nullboolean_field"], False)
        self.assertEqual(response.data["results"][2]["nullboolean_field"], False)
        self.assertEqual(response.data["results"][1]["nullboolean_field"], True)
        self.assertEqual(response.data["results"][0]["nullboolean_field"], True)
        self.assertEqual(response.data["results"][4]["nullboolean_field"], None)
        self.assertEqual(response.data["results"][5]["nullboolean_field"], None)

    def test_ordering_char_field(self):
        ExampleModelOneFactory.create(char_field="echo")
        ExampleModelOneFactory.create(char_field="delta")
        ExampleModelOneFactory.create(char_field="alpha")
        ExampleModelOneFactory.create(char_field="charlie")
        ExampleModelOneFactory.create(char_field="foxtrot")
        ExampleModelOneFactory.create(char_field="beta")

        response = self.client.get(self.url, {"_order": "char_field"})

        self.assertEqual(response.data["results"][0]["char_field"], "alpha")
        self.assertEqual(response.data["results"][1]["char_field"], "beta")
        self.assertEqual(response.data["results"][2]["char_field"], "charlie")
        self.assertEqual(response.data["results"][3]["char_field"], "delta")
        self.assertEqual(response.data["results"][4]["char_field"], "echo")
        self.assertEqual(response.data["results"][5]["char_field"], "foxtrot")

    def test_ordering_char_field(self):
        ExampleModelOneFactory.create(char_field="echo")
        ExampleModelOneFactory.create(char_field="delta")
        ExampleModelOneFactory.create(char_field="alpha")
        ExampleModelOneFactory.create(char_field="charlie")
        ExampleModelOneFactory.create(char_field="foxtrot")
        ExampleModelOneFactory.create(char_field="beta")

        response = self.client.get(self.url, {"_order": "-char_field"})

        self.assertEqual(response.data["results"][5]["char_field"], "alpha")
        self.assertEqual(response.data["results"][4]["char_field"], "beta")
        self.assertEqual(response.data["results"][3]["char_field"], "charlie")
        self.assertEqual(response.data["results"][2]["char_field"], "delta")
        self.assertEqual(response.data["results"][1]["char_field"], "echo")
        self.assertEqual(response.data["results"][0]["char_field"], "foxtrot")

    def test_ordering_text_field(self):
        ExampleModelOneFactory.create(text_field="echo")
        ExampleModelOneFactory.create(text_field="delta")
        ExampleModelOneFactory.create(text_field="alpha")
        ExampleModelOneFactory.create(text_field="charlie")
        ExampleModelOneFactory.create(text_field="foxtrot")
        ExampleModelOneFactory.create(text_field="beta")

        response = self.client.get(self.url, {"_order": "text_field"})

        self.assertEqual(response.data["results"][0]["text_field"], "alpha")
        self.assertEqual(response.data["results"][1]["text_field"], "beta")
        self.assertEqual(response.data["results"][2]["text_field"], "charlie")
        self.assertEqual(response.data["results"][3]["text_field"], "delta")
        self.assertEqual(response.data["results"][4]["text_field"], "echo")
        self.assertEqual(response.data["results"][5]["text_field"], "foxtrot")

    def test_ordering_text_field_desc(self):
        ExampleModelOneFactory.create(text_field="echo")
        ExampleModelOneFactory.create(text_field="delta")
        ExampleModelOneFactory.create(text_field="alpha")
        ExampleModelOneFactory.create(text_field="charlie")
        ExampleModelOneFactory.create(text_field="foxtrot")
        ExampleModelOneFactory.create(text_field="beta")

        response = self.client.get(self.url, {"_order": "-text_field"})

        self.assertEqual(response.data["results"][5]["text_field"], "alpha")
        self.assertEqual(response.data["results"][4]["text_field"], "beta")
        self.assertEqual(response.data["results"][3]["text_field"], "charlie")
        self.assertEqual(response.data["results"][2]["text_field"], "delta")
        self.assertEqual(response.data["results"][1]["text_field"], "echo")
        self.assertEqual(response.data["results"][0]["text_field"], "foxtrot")

    def test_ordering_slug_field(self):
        ExampleModelOneFactory.create(slug_field="echo")
        ExampleModelOneFactory.create(slug_field="delta")
        ExampleModelOneFactory.create(slug_field="alpha")
        ExampleModelOneFactory.create(slug_field="charlie")
        ExampleModelOneFactory.create(slug_field="foxtrot")
        ExampleModelOneFactory.create(slug_field="beta")

        response = self.client.get(self.url, {"_order": "-slug_field"})

        self.assertEqual(response.data["results"][5]["slug_field"], "alpha")
        self.assertEqual(response.data["results"][4]["slug_field"], "beta")
        self.assertEqual(response.data["results"][3]["slug_field"], "charlie")
        self.assertEqual(response.data["results"][2]["slug_field"], "delta")
        self.assertEqual(response.data["results"][1]["slug_field"], "echo")
        self.assertEqual(response.data["results"][0]["slug_field"], "foxtrot")
