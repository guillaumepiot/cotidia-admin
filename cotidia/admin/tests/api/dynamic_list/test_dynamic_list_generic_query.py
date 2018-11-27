from decimal import Decimal
from datetime import datetime

from django.urls import reverse
from rest_framework.test import APITestCase
from cotidia.account import fixtures
from cotidia.admin.tests.factory import ExampleModelOneFactory, ExampleModelTwoFactory


class AdminSearchDashboardTestsGeneralQuery(APITestCase):
    @fixtures.admin_user
    def setUp(self):
        self.url = reverse("dynamic-api:exampleone-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.admin_user_token.key)

    def test_general_query(self):
        ExampleModelOneFactory.create(char_field="foobar")
        ExampleModelOneFactory.create(text_field="dobeefoobee")
        ExampleModelOneFactory.create(slug_field="lafoot")
        ExampleModelOneFactory.create(text_field="")

        response = self.client.get(self.url, {"_q": "foo"})

        self.assertEqual(response.data["total_result_count"], 3)
