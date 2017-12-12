from django.conf.urls import include, url

from cotidia.admin.tests.views import (
        AdminTestOrderableAPIView,
        AdminTestSearchDashboardAPIView,
        TestAdminPageView,
        stub_view
        )

generic_admin_urls = [
            url(r'home/$', TestAdminPageView.as_view(), name="test_view"),
            url(r'stub/(?P<id>[\d]+)$', stub_view, name="genericrecord-list")
        ]

urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminTestOrderableAPIView.as_view(),
        name='order'
    ),
    url(
        r'^api/admin/',
        include("cotidia.admin.urls.api", namespace="generic-api")
        ),
    url(r'^test/',
        include(generic_admin_urls, namespace="generic-admin"),
        )

]

