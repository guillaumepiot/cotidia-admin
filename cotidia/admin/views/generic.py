from django.views.generic import ListView

from cotidia.admin.utils import StaffPermissionRequiredMixin


class AdminListView(StaffPermissionRequiredMixin, ListView):
    columns = ()
    paginate_by = 25
    template_type = "fluid"  # Options: fluid, centered

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["columns"] = self.columns
        context["template_type"] = self.template_type

        context["app_label"] = self.model._meta.app_label
        context["model_name"] = self.model._meta.model_name
        context["object_name"] = self.model._meta.object_name

        return context

    def get_template_names(self):

        template = "admin/{app}/{model}/list.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/list.html",
        ]
