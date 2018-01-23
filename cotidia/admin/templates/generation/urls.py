from django.urls import re_path

from {{app_label}}.views.admin.{{model_name|lower}} import (
    {{model_name}}List,
    {{model_name}}Create,
    {{model_name}}Detail,
    {{model_name}}Update,
    {{model_name}}Delete
)

urlpatterns = [
    re_path(r'^$', {{model_name}}List.as_view(), name='{{model_name|lower}}-list'),
    re_path(r'^add$', {{model_name}}Create.as_view(), name='{{model_name|lower}}-add'),
    re_path(r'^(?P<pk>[\d]+)$', {{model_name}}Detail.as_view(), name='{{model_name|lower}}-detail'),
    re_path(r'^(?P<pk>[\d]+)/update$', {{model_name}}Update.as_view(),
         name='{{model_name|lower}}-update'),
    re_path(r'^(?P<pk>[\d]+)/delete$', {{model_name}}Delete.as_view(),
         name='{{model_name|lower}}-delete'),
]
