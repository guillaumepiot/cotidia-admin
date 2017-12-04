from django.conf.urls import url

from cotidia.admin.views.api import AdminOrderableAPIView
from cotidia.admin.views.api import AdminSearchDashboardAPIView

urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminOrderableAPIView.as_view(),
        name='order'
    ),
    url(
        r'^list/(?P<content_type_id>[\d]+)',
        AdminSearchDashboardAPIView.as_view(),
        name='object-list'
        )
]
