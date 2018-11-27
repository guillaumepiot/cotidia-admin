from django.urls import re_path, path, include

from cotidia.admin.tests.serializers import DynamicListModelOneSerializer
from cotidia.admin.views.api import DynamicListAPIView

app_name = "dynamic-api"

urlpatterns = [
    path(
        r"admin/dynamic-list",
        DynamicListAPIView.as_view(),
        {
            "model": "examplemodelone",
            "app_label": "tests",
            "serializer_class": DynamicListModelOneSerializer,
        },
        name="exampleone-list",
    )
]
