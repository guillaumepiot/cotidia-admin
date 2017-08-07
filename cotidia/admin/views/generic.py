from django.views.generic import ListView

from cotidia.admin.utils import StaffPermissionRequiredMixin


class AdminListView(StaffPermissionRequiredMixin, ListView):
    columns = ()
    paginate_by = 25

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["column_headers"] = (column[0] for column in self.columns)
        context["columns"] = (column[1] for column in self.columns)

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
