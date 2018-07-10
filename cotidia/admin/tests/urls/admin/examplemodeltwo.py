from django.urls import re_path

from cotidia.admin.tests.views.admin.examplemodeltwo import (
    ExampleModelTwoList,
    ExampleModelTwoCreate,
    ExampleModelTwoDetail,
    ExampleModelTwoUpdate,
    ExampleModelTwoDelete
)
from cotidia.admin.views.generic import AdminGenericListView

urlpatterns = [
    re_path(
        r'^$',
        AdminGenericListView.as_view(), {"app_label": "cotidia.admin.tests", "model": "examplemodeltwo"},
        name='examplemodeltwo-list'
    ),
    re_path(r'^add$', ExampleModelTwoCreate.as_view(), name='examplemodeltwo-add'),
    re_path(r'^(?P<pk>[\d]+)$', ExampleModelTwoDetail.as_view(), name='examplemodeltwo-detail'),
    re_path(r'^(?P<pk>[\d]+)/update$', ExampleModelTwoUpdate.as_view(),
         name='examplemodeltwo-update'),
    re_path(r'^(?P<pk>[\d]+)/delete$', ExampleModelTwoDelete.as_view(),
         name='examplemodeltwo-delete'),
]
