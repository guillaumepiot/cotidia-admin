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
        content_type_id = ContentType.objects.get_for_model(GenericRecord).id
        context = {
                "app_label": "generic",
                "model_name": "object",
                "url_type": "list",
                "content_type_id": content_type_id,
                }
        return render(self.request, "admin/generic/utils/test.html", context)

def stub_view(request, *args, **kwargs):
    return HttpResponse()
