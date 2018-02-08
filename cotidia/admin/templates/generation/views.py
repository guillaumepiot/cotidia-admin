from django.views.generic import ListView, DetailView
from django.urls import reverse
from django.contrib import messages
from cotidia.admin.views import AdminListView
from django.conf import settings

from cotidia.account.utils import StaffPermissionRequiredMixin

from cotidia.admin.views import (
    AdminListView,
    AdminDetailView,
    AdminDeleteView,
    AdminCreateView,
    AdminUpdateView
)

from {{app_label}}.models import {{model_name}}
from {{app_label}}.forms.admin.{{model_name|lower}} import (
    {{model_name}}AddForm,
    {{model_name}}UpdateForm)

class {{model_name}}List(AdminListView):
    columns = (
        {% for field in fields %} ("{{field.0}}", "{{field.1}}"),{% if not forloop.last %}
        {% endif %}{% endfor %}
    )
    model = {{model_name}}


class {{model_name}}Detail(StaffPermissionRequiredMixin, AdminDetailView):
    model = {{model_name}}
    permission_required = '{{app_label}}.change_model'
    fieldsets = [
        {
            "legend": '{{model_verbose_name}} Details',
            "fields":[
                [
                    {% for field in fields %}{
                        "label": "{{field.0}}",
                        "field": "{{field.1}}"
                    },
                    {% endfor %}
                ]
            ]
        }
    ]


class {{model_name}}Create(StaffPermissionRequiredMixin, AdminCreateView):
    model = {{model_name}}
    form_class = {{model_name}}AddForm
    permission_required = '{{app_label}}.add_model'

    def get_success_url(self):
        messages.success(self.request, '{{model_name}} has been created.')
        return reverse('{{app_label}}-admin:{{model_name|lower}}-detail', kwargs={'pk': self.object.id})


class {{model_name}}Update(StaffPermissionRequiredMixin, AdminUpdateView):
    model = {{model_name}}
    form_class = {{model_name}}UpdateForm
    permission_required = '{{app_label}}.change_model'

    def get_success_url(self):
        messages.success(self.request, '{{model_name}} details have been updated.')
        return reverse('{{app_label}}-admin:{{model_name|lower}}-detail', kwargs={'pk': self.object.id})


class {{model_name}}Delete(StaffPermissionRequiredMixin, AdminDeleteView):
    model = {{model_name}}
    permission_required = 'app.delete_model'

    def get_success_url(self):
        messages.success(self.request, '{{model_name}} has been deleted.')
        return reverse('{{app_label}}-admin:{{model_name|lower}}-list')