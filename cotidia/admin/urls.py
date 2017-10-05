from django.conf.urls import url

from cotidia.admin.views import AdminOrderableView


urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminOrderableView.as_view(),
        name='order'
    ),
]
