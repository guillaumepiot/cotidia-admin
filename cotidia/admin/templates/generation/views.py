from django.views.generic import ListView, DetailView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.core.urlresolvers import reverse
from django.contrib import messages
from cotidia.admin.views import AdminListView
from django.conf import settings

from cotidia.account.utils import StaffPermissionRequiredMixin
from {{app_label}}.models import {{model_name}}
from {{app_label}}.forms.admin.model import (
    {{model_name}}AddForm,
    {{model_name}}UpdateForm)

class {{model_name}}List(AdminListView):
    columns = (
            {% for field in fields %}
            ({{field.label}}, {{field.name}}),
            {% endfor %}
        )
        model = {{model_name}}


class {{model_name}}Detail(StaffPermissionRequiredMixin, DetailView):
    model = {{model_name}}
    template_name = 'admin/{{app_label}}/{{model_name}}/{{model_name|lower}}_detail.html'
    permission_required = 'app.change_model'


class {{model_name}}Create(StaffPermissionRequiredMixin, CreateView):
    model = {{model_name}}
    form_class = {{model_name}}AddForm
    template_name = 'admin/{{app_label}}/{{model_name}}/{{model_name|lower}}_form.html'
    permission_required = 'app.add_model'

    def get_success_url(self):
        messages.success(self.request, '{{model_name}} has been created.')
        return reverse('{{app_label}}-admin:{{model_name|lower}}-detail', kwargs={'pk': self.object.id})


class {{model_name}}Update(StaffPermissionRequiredMixin, UpdateView):
    model = {{model_name}}
    form_class = {{model_name}}UpdateForm
    template_name = 'admin/{{app_label}}/{{model_name}}/{{model_name|lower}}_form.html'
    permission_required = 'app.change_model'

    def get_success_url(self):
        messages.success(self.request, '{{model_name}} details have been updated.')
        return reverse('{{app_label}}-admin:{{model_name|lower}}-detail', kwargs={'pk': self.object.id})


class {{model_name}}Delete(StaffPermissionRequiredMixin, DeleteView):
    model = {{model_name}}
    permission_required = 'app.delete_model'
    template_name = 'admin/{{app_label}}/{{model_name}}/{{model_name|lower}}_confirm_delete.html'

    def get_success_url(self):
        messages.success(self.request, '{{model_name}} has been deleted.')
            return reverse('{{app_label}}-admin:{{model_name|lower}}-list')
