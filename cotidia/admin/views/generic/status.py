from django.contrib.contenttypes.models import ContentType

from cotidia.admin.views.generic.list import AdminListView
from cotidia.core.models import Status


class AdminGenericStatusHistoryView(AdminListView):
    """List all the statuses for an object."""

    model = Status
    template_name = "admin/core/status/list.html"

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

    # def get(self, *args, **kwargs):
    #         model = kwargs["model"]
    #         app_label = kwargs["app_label"]

    #     #     serializer_class = kwargs.get("serializer_class", None)

    #     #     fmt = kwargs["format"]
    #     #     default_filename = "{} - {}".format(app_label, model)
    #     #     filename = kwargs.get("filename", default_filename)

    #         model_class = ContentType.objects.get(
    #             app_label=app_label, model=model
    #         ).model_class()

    #     #     if not serializer_class:
    #     #         serializer_class = model_class.get_admin_serializer()

    #         qs = get_queryset(
    #             model_class, filter_args=self.request.GET
    #         )

    #     #     data = serializer_class(qs, many=True).data

    #     #     if fmt == "csv":
    #     #         return render_to_csv(data, filename=filename)
    #     #     elif fmt == "pdf":
    #     #         return render_to_pdf(data, filename=filename)

    #     #     response = HttpResponse("No format to render.")

    #     return response
