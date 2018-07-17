from django.urls import path

from cotidia.admin.views.api import (
    AdminOrderableAPIView,
    SortAPIView,
    AdminSearchDashboardAPIView,
    AdminSearchLookupAPIView,
    AdminBatchActionAPIView,
    AdminMultipleSelectAPIView
)

app_name = "cotidia.admin"

urlpatterns = [
    path(
        'order/<int:content_type_id>/<int:object_id>',
        AdminOrderableAPIView.as_view(),
        name='order'
    ),
    path(
        'sort/<int:content_type_id>',
        SortAPIView.as_view(),
        name="sort"),
    path(
        'list/<str:app_label>/<str:model>',
        AdminSearchDashboardAPIView.as_view(),
        name='object-list'
    ),
    path(
        'batch-action/<str:app_label>/<str:model_name>/<str:action>',
        AdminBatchActionAPIView.as_view(),
        name='batch-action'
    ),
    path(
        'search-lookup',
        AdminSearchLookupAPIView.as_view(),
        name='search-lookup'
    ),
    path(
        'multiple-select-lookup/<str:app_label>/<str:model_name>/',
        AdminMultipleSelectAPIView.as_view(),
        name='multiple-select-lookup'
    )
]
