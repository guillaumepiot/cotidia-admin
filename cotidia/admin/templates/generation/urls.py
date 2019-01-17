from django.urls import path

from {{app_label}}.views.admin.{{model_name|lower}} import (
    {{model_name}}List,
    {{model_name}}Create,
    {{model_name}}Detail,
    {{model_name}}Update,
    {{model_name}}Delete
)

urlpatterns = [
    path('', {{model_name}}List.as_view(), name='{{model_name|lower}}-list'),
    path('add', {{model_name}}Create.as_view(), name='{{model_name|lower}}-add'),
    path('<pk>', {{model_name}}Detail.as_view(), name='{{model_name|lower}}-detail'),
    path('<pk>/update', {{model_name}}Update.as_view(),
         name='{{model_name|lower}}-update'),
    path('<pk>/delete', {{model_name}}Delete.as_view(),
         name='{{model_name|lower}}-delete'),
]
