import django_filters

from django.contrib.contenttypes.models import ContentType

from cotidia.admin.views.generic.list import AdminListView
from cotidia.core.models import Status


class StatusFilter(django_filters.FilterSet):
    status = django_filters.CharFilter(lookup_expr="icontains", label="Status")

    class Meta:
        model = Status
        fields = ["status"]


class AdminGenericStatusHistoryView(AdminListView):
    """List all the statuses for an object."""

    model = Status
    template_name = "admin/core/status/list.html"
    filterset = StatusFilter

    def get_permission_required(self, *args, **kwargs):
        perms = "{}.change_{}".format(self.kwargs["app_label"], self.kwargs["model"])
        return perms

    def get_queryset(self):
        content_type = ContentType.objects.get(
            app_label=self.kwargs["app_label"], model=self.kwargs["model"]
        )
        queryset = super().get_queryset()
        queryset = queryset.filter(
            object_id=self.kwargs["object_id"], content_type=content_type
        )
        if self.kwargs.get("taxonomy"):
            queryset = queryset.filter(taxonomy=self.kwargs["taxonomy"])
        return queryset
