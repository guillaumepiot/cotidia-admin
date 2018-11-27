from cotidia.admin.views.api import AdminOrderableAPIView, AdminSearchDashboardAPIView
from django.views.generic import View
from django.shortcuts import render
from django.contrib.contenttypes.models import ContentType
from django.http import HttpResponse

from .models import GenericRecord


class AdminTestOrderableAPIView(AdminOrderableAPIView):
    pass


class AdminTestSearchDashboardAPIView(AdminSearchDashboardAPIView):
    pass


class TestAdminPageView(View):
    def get(self, *args, **kwargs):
        content_type = ContentType.objects.get_for_model(GenericRecord)

        context = {
            "app_label": content_type.app_label,
            "model_name": content_type.model,
            "url_type": "list",
            "content_type_id": content_type.id,
            "default_columns": [],
            "default_filters": [],
            "default_order": [],
        }

        return render(self.request, "admin/generic/utils/test.html", context)


def stub_view(request, *args, **kwargs):
    return HttpResponse()
