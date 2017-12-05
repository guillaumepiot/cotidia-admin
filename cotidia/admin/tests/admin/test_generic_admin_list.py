from django.test import TestCase
from django.urls import reverse
from cotidia.account.models import User
from cotidia.account import fixtures


class TestGenericAdminList(TestCase):

    def setup(self):
        pass

    @fixtures.admin_user
    def test_generic_admin_list(self):
        self.user = self.admin_user
        self.client.login(username=self.admin_user.username, password=self.admin_user_pwd)
        url = reverse("generic-admin:test_view")
        response = self.client.get(url, {})

        self.assertIn(self.admin_user_token.key, str(response.content))
        self.assertIn("/test/stub/:id", str(response.content))
        self.assertIn("/api/admin/list/14", str(response.content))
