from django.conf.urls import url

from cotidia.admin.views.generic import (
    AdminOrderableView,
    AdminGenericListView
)


urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminOrderableView.as_view(),
        name='order'
    ),
    url(
        r'^list/(?P<app_label>[a-zA-Z_]+)/(?P<model>[a-zA-Z_]+)',
        AdminGenericListView.as_view(),
        name='list'
        )
]
