from django.urls import path

from cotidia.admin.views.api import AdminOrderableAPIView
from cotidia.admin.views.api import AdminSearchDashboardAPIView

app_name = "cotidia.admin"

urlpatterns = [
    path(
        'order/<int:content_type_id>/<int:object_id>',
        AdminOrderableAPIView.as_view(),
        name='order'
    ),
    path(
        'list/<str:app_label>/<str:model>',
        AdminSearchDashboardAPIView.as_view(),
        name='object-list'
    )
]
