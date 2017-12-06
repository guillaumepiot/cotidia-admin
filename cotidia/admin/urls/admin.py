from django.conf.urls import url

from cotidia.admin.views import AdminOrderableView, AdminGenericListView


urlpatterns = [
    url(
        r'^order/(?P<content_type_id>[\d]+)/(?P<object_id>[\d]+)$',
        AdminOrderableView.as_view(),
        name='order'
    ),
    url(
        r'^admin/generic/list/(?<content_type_id>)',
        AdminGenericListView.as_view()
        )
]
