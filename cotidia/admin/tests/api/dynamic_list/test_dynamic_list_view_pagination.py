from pprint import pprint
from decimal import Decimal
from datetime import datetime, date

from django.urls import reverse

from rest_framework.test import APITestCase

from cotidia.account import fixtures
from cotidia.admin.tests.factory import ExampleModelOneFactory, ExampleModelTwoFactory


class AdminSearchDashboardTests(APITestCase):
    @fixtures.admin_user
    def setUp(self):
        self.url = reverse("dynamic-api:exampleone-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.admin_user_token.key)

    def test_pagination_info_string(self):
        date_time = datetime.now()

        foreign_model = ExampleModelTwoFactory()
        ExampleModelOneFactory.create_batch(60)

        response = self.client.get(self.url, {})

        self.assertEqual(
            response.data["meta"]["footer_info"],
            (
                "page_result_count 50 "
                "total_result_count 60 "
                "current_page 1 "
                "page_count 2 "
                "first_result_count 1 "
                "last_result_count 50 "
                "per_page 50 "
            ),
        )
