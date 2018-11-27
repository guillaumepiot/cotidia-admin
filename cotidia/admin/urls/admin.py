from django.urls import path

from cotidia.admin.views.generic import (
    AdminOrderableView,
    AdminGenericSearchView,
    AdminGenericExportView,
    DynamicListView,
)

app_name = "cotidia.admin"

urlpatterns = [
    path(
        "order/<int:content_type_id>/<int:object_id>",
        AdminOrderableView.as_view(),
        name="order",
    ),
    path("list/<str:app_label>/<str:model>", DynamicListView.as_view(), name="list"),
    path("search", AdminGenericSearchView.as_view(), name="search"),
    path(
        "list/<str:app_label>/<str:model>", AdminGenericListView.as_view(), name="list"
    ),
    path("search", AdminGenericSearchView.as_view(), name="search"),
    path(
        "export/<str:app_label>/<str:model>/csv",
        AdminGenericExportView.as_view(),
        {"format": "csv"},
        name="export-csv",
    ),
    path(
        "export/<str:app_label>/<str:model>/pdf",
        AdminGenericExportView.as_view(),
        {"format": "pdf"},
        name="export-pdf",
    ),
]
