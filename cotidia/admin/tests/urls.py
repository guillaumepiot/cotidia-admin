from django.conf.urls import url

from cotidia.admin.tests.views import AdminTestOrderableAPIView, AdminTestSearchDashboardAPIView


urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminTestOrderableAPIView.as_view(),
        name='order'
    ),
    url(
        r'^dashboard/(?P<content_type_id>[\d]+)',
        AdminTestSearchDashboardAPIView.as_view(),
        name='dashboard'
        )
]
