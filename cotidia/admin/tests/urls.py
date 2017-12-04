from django.conf.urls import include, url

from cotidia.admin.tests.views import AdminTestOrderableAPIView, AdminTestSearchDashboardAPIView


urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminTestOrderableAPIView.as_view(),
        name='order'
    ),
    url(
        r'^api/admin/',
        include("cotidia.admin.urls.api", namespace="generic-api")
        )
]
