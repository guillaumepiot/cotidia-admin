from django.urls import re_path, path, include

from cotidia.admin.tests.views import (
        AdminTestOrderableAPIView,
        AdminTestSearchDashboardAPIView,
        TestAdminPageView,
        stub_view
        )

generic_admin_urls = ([
            re_path(r'home/$', TestAdminPageView.as_view(), name="test_view"),
        ], 'cotidia.admin.tests')
app_name = "cotidia.admin.tests"

urlpatterns = [
    path(
        r'admin/generic/',
        include('cotidia.admin.urls.admin', namespace="generic-admin"),
        ),
    re_path(
        r'stub/(?P<id>[\d]+)$',
        stub_view,
        name="generic-admin:genericrecord-list"
        ),
    path(
        r'api/admin/',
        include("cotidia.admin.urls.api", namespace="generic-api")
        ),

]
