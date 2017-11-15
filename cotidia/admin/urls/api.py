from django.conf.urls import url

from cotidia.admin.views.api import AdminOrderableAPIView

urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminOrderableAPIView.as_view(),
        name='order'
    ),
]
