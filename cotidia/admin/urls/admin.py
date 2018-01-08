from django.urls import path

from cotidia.admin.views.generic import (
    AdminOrderableView,
    AdminGenericListView,
    AdminGenericSearchView
)

app_name = "cotidia.admin"

urlpatterns = [
    path(
        'order/<int:content_type_id>/<int:object_id>',
        AdminOrderableView.as_view(),
        name='order'
    ),
    path(
        'list/<str:app_label>/<str:model>',
        AdminGenericListView.as_view(),
        name='list'
    ),
    path(
        'search',
        AdminGenericSearchView.as_view(),
        name='search'
    )
]
