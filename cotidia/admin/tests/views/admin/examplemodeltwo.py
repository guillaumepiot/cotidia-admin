import django_filters

from django.views.generic import ListView, DetailView
from django.urls import reverse
from django.contrib import messages
from django.conf import settings

from cotidia.account.utils import StaffPermissionRequiredMixin

from cotidia.admin.views import (
    AdminListView,
    AdminDetailView,
    AdminDeleteView,
    AdminCreateView,
    AdminUpdateView,
)

from cotidia.admin.tests.models import ExampleModelTwo
from cotidia.admin.tests.forms.admin.examplemodeltwo import (
    ExampleModelTwoAddForm,
    ExampleModelTwoUpdateForm,
)


class ExampleModelTwoFilter(django_filters.FilterSet):
    class Meta:
        model = ExampleModelTwo

        fields = ["id", "number", "name", "other_model"]


class ExampleModelTwoList(AdminListView):
    columns = (
        ("ID", "id"),
        ("number", "number"),
        ("name", "name"),
        ("other model", "other_model"),
    )

    model = ExampleModelTwo

    filterset = ExampleModelTwoFilter

    row_actions = ["create", "update", "view", "delete"]


class ExampleModelTwoDetail(AdminDetailView):
    model = ExampleModelTwo

    permission_required = "tests.change_examplemodeltwo"

    fieldsets = [
        {
            "legend": "Example Model Two Details",
            "fields": [
                [{"label": "ID", "field": "id"}],
                [{"label": "number", "field": "number"}],
                [{"label": "name", "field": "name"}],
                [{"label": "other model", "field": "other_model"}],
            ],
        }
    ]


class ExampleModelTwoCreate(AdminCreateView):
    model = ExampleModelTwo

    form_class = ExampleModelTwoAddForm

    permission_required = "tests.add_examplemodeltwo"

    def get_success_url(self):
        messages.success(self.request, "ExampleModelTwo has been created.")

        return reverse(
            "tests-admin:examplemodeltwo-detail", kwargs={"pk": self.object.id}
        )


class ExampleModelTwoUpdate(AdminUpdateView):
    model = ExampleModelTwo

    form_class = ExampleModelTwoUpdateForm

    permission_required = "tests.change_examplemodeltwo"

    def get_success_url(self):
        messages.success(self.request, "ExampleModelTwo details have been updated.")

        return reverse(
            "tests-admin:examplemodeltwo-detail", kwargs={"pk": self.object.id}
        )


class ExampleModelTwoDelete(AdminDeleteView):
    model = ExampleModelTwo

    permission_required = "app.delete_examplemodeltwo"

    def get_success_url(self):
        messages.success(self.request, "ExampleModelTwo has been deleted.")

        return reverse("tests-admin:examplemodeltwo-list")
