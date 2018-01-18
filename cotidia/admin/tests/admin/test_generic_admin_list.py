from django.test import TestCase
from django.urls import reverse
from cotidia.account.models import User
from cotidia.account import fixtures

from cotidia.admin.tests.factory import GenericRecordFactory
from cotidia.admin.templatetags.admin_search_dashboard_tags import render_search_dashboard_config
from django.contrib.contenttypes.models import ContentType


class TestGenericAdminList(TestCase):

    def setup(self):
        pass

    @fixtures.admin_user
    def test_generic_admin_list(self):
        self.user = self.admin_user
        self.client.login(
            username=self.admin_user,
            password=self.admin_user_pwd
        )
        config = render_search_dashboard_config(
            {},
            "tests",
            "genericrecord",
            "detail",
            self.admin_user_token.key,
            [],[],[]
            )
        self.assertIn(self.admin_user_token.key, str(config))
        self.assertIn("/api/admin/list/tests/genericrecord", str(config))
