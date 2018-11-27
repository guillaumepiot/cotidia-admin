import django_filters

from django.views.generic import ListView, DetailView
from django.urls import reverse
from django.contrib import messages
from django.conf import settings

from cotidia.admin.views import (
    AdminListView,
    AdminDetailView,
    AdminDeleteView,
    AdminCreateView,
    AdminUpdateView,
)

from cotidia.admin.tests.models import ExampleModelOne
from cotidia.admin.tests.forms.admin.examplemodelone import (
    ExampleModelOneAddForm,
    ExampleModelOneUpdateForm,
)

from cotidia.account.utils import StaffPermissionRequiredMixin


class ExampleModelOneFilter(django_filters.FilterSet):
    class Meta:
        model = ExampleModelOne

        fields = []


class ExampleModelOneList(AdminListView):
    columns = (
        ("integer field", "integer_field"),
        ("float field", "float_field"),
        ("decimal field", "decimal_field"),
        ("boolean field", "boolean_field"),
        ("nullboolean field", "nullboolean_field"),
        ("char field", "char_field"),
        ("text field", "text_field"),
        ("email field", "email_field"),
        ("slug field", "slug_field"),
        ("date field", "date_field"),
        ("datetime field", "datetime_field"),
        ("time field", "time_field"),
        ("duration field", "duration_field"),
        ("other model", "other_model"),
        ("many to many field", "many_to_many_field"),
    )

    model = ExampleModelOne

    filterset = ExampleModelOneFilter

    row_actions = ["create", "update", "view", "delete"]


class ExampleModelOneDetail(AdminDetailView):
    model = ExampleModelOne

    permission_required = "cotidia.admin.tests.change_examplemodelone"

    fieldsets = [
        {
            "legend": "Example Model One Details",
            "fields": [
                [{"label": "integer field", "field": "integer_field"}],
                [{"label": "float field", "field": "float_field"}],
                [{"label": "decimal field", "field": "decimal_field"}],
                [{"label": "boolean field", "field": "boolean_field"}],
                [{"label": "nullboolean field", "field": "nullboolean_field"}],
                [{"label": "char field", "field": "char_field"}],
                [{"label": "text field", "field": "text_field"}],
                [{"label": "email field", "field": "email_field"}],
                [{"label": "slug field", "field": "slug_field"}],
                [{"label": "date field", "field": "date_field"}],
                [{"label": "datetime field", "field": "datetime_field"}],
                [{"label": "time field", "field": "time_field"}],
                [{"label": "duration field", "field": "duration_field"}],
                [{"label": "other model", "field": "other_model"}],
                [{"label": "many to many field", "field": "many_to_many_field"}],
            ],
        }
    ]


class ExampleModelOneCreate(AdminCreateView):
    model = ExampleModelOne

    form_class = ExampleModelOneAddForm

    permission_required = "cotidia.admin.tests.add_examplemodelone"

    def get_success_url(self):
        messages.success(self.request, "ExampleModelOne has been created.")

        return reverse(
            "tests-admin:examplemodelone-detail", kwargs={"pk": self.object.id}
        )


class ExampleModelOneUpdate(AdminUpdateView):
    model = ExampleModelOne

    form_class = ExampleModelOneUpdateForm

    permission_required = "tests.change_examplemodelone"

    def get_success_url(self):
        messages.success(self.request, "ExampleModelOne details have been updated.")

        return reverse(
            "tests-admin:examplemodelone-detail", kwargs={"pk": self.object.id}
        )


class ExampleModelOneDelete(AdminDeleteView):
    model = ExampleModelOne

    permission_required = "app.delete_examplemodelone"

    def get_success_url(self):
        messages.success(self.request, "ExampleModelOne has been deleted.")

        return reverse("tests-admin:examplemodelone-list")
