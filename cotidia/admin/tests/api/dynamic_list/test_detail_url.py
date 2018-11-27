from django.urls import reverse

from rest_framework.test import APITestCase

from cotidia.account import fixtures
from cotidia.admin.tests.factory import ExampleModelOneFactory


class AdminSearchDashboardTestsGeneralQuery(APITestCase):
    @fixtures.admin_user
    def setUp(self):
        self.url = reverse("dynamic-api:exampleone-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.admin_user_token.key)

    def test_general_query(self):
        obj = ExampleModelOneFactory.create(char_field="foobar")

        response = self.client.get(self.url)

        self.assertEqual(
            response.data["results"][0]["_detail_url"], obj.get_admin_detail_url()
        )
