from django.urls import re_path, path, include

from cotidia.admin.tests.views import (
    AdminTestOrderableAPIView,
    AdminTestSearchDashboardAPIView,
    TestAdminPageView,
    stub_view,
)
from cotidia.admin.tests.serializers import DynamicListModelOneSerializer
from cotidia.admin.views.api import DynamicListAPIView

generic_admin_urls = (
    [re_path(r"home/$", TestAdminPageView.as_view(), name="test_view")],
    "cotidia.admin.tests",
)
app_name = "cotidia.admin.tests"

urlpatterns = [
    path(
        r"admin/generic/",
        include("cotidia.admin.urls.admin", namespace="generic-admin"),
    ),
    re_path(r"stub/(?P<id>[\d]+)$", stub_view, name="generic-admin:genericrecord-list"),
    path(r"api/admin/", include("cotidia.admin.urls.api", namespace="generic-api")),
    path(
        r"api/admin/dynamic-list",
        DynamicListAPIView.as_view(),
        {
            "model": "examplemodelone",
            "app_label": "tests",
            "serializer_class": DynamicListModelOneSerializer,
        },
        name="dynamic-admin-api-page",
    ),
]
