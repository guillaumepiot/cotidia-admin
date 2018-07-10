from django.urls import re_path

from cotidia.admin.tests.views.admin.examplemodelone import (
    ExampleModelOneList,
    ExampleModelOneCreate,
    ExampleModelOneDetail,
    ExampleModelOneUpdate,
    ExampleModelOneDelete
)
from cotidia.admin.views.generic import AdminGenericListView

urlpatterns = [
    re_path(r'^$', AdminGenericListView.as_view(), {
            "app_label": "cotidia.admin.tests", "model": "examplemodelone"}, name='examplemodelone-list'),
    re_path(r'^add$', ExampleModelOneCreate.as_view(),
            name='examplemodelone-add'),
    re_path(r'^(?P<pk>[\d]+)$', ExampleModelOneDetail.as_view(),
            name='examplemodelone-detail'),
    re_path(r'^(?P<pk>[\d]+)/update$', ExampleModelOneUpdate.as_view(),
         name='examplemodelone-update'),
    re_path(r'^(?P<pk>[\d]+)/delete$', ExampleModelOneDelete.as_view(),
         name='examplemodelone-delete'),
]
