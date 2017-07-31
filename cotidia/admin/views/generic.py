from django.views.generic import ListView

from cotidia.admin.utils import StaffPermissionRequiredMixin


class AdminListView(StaffPermissionRequiredMixin, ListView):
    columns = ()
    template_name = 'admin/generic/list.html'
    paginate_by = 25

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['column_headers'] = (column[0] for column in self.columns)
        context['columns'] = (column[1] for column in self.columns)

        return context
