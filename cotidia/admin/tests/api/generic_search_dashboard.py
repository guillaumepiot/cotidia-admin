
from rest_framework.test import APITestCase

from django.urls import reverse
from django.contrib.contenttypes.models import ContentType

from cotidia.admin.tests.models import GenericRecord, GenericRecordNoMeta
from cotidia.account import fixtures
from cotidia.admin.tests.factory import GenericRecordFactory


class AdminSearchDashboardTests(APITestCase):
    @fixtures.normal_user
    def setUp(self):
        pass

    def test_getting_data(self):
        GenericRecordFactory()
        GenericRecordFactory()
        GenericRecordFactory()
        self.client.credentials(
            HTTP_AUTHORIZATION='Token ' + self.normal_user_token.key
        )
        content_type = ContentType.objects.get_for_model(GenericRecord).id
        url = reverse("dashboard", kwargs={"content_type_id": content_type})
        response = self.client.get(url, {})
        print(response)
