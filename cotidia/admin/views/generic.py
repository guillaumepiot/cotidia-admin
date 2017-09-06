from django.views.generic import (
    ListView,
    DetailView,
    DeleteView,
    CreateView,
    UpdateView
)
from django.contrib import messages
from django.core.urlresolvers import reverse

from cotidia.admin.utils import StaffPermissionRequiredMixin
from cotidia.admin.views.mixin import ContextMixin, ChildMixin


class AdminListView(StaffPermissionRequiredMixin, ContextMixin, ListView):
    columns = ()
    paginate_by = 25
    template_type = "fluid"  # Options: fluid, centered
    filterset = None

    def get_permission_required(self):
        if self.permission_required is None:
            return self.permission_required
        else:
            return "{}.add_{}".format(
                self.model._meta.app_label,
                self.model._meta.object_name
            )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["columns"] = self.columns

        if self.filterset:
            context["filter"] = self.filterset(
                self.request.GET,
                queryset=self.get_queryset()
            )
            context["object_list"] = context["filter"].qs

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


class AdminDetailView(StaffPermissionRequiredMixin, ContextMixin, DetailView):
    template_type = "centered"  # Options: fluid, centered
    fieldsets = []

    def get_permission_required(self):
        if self.permission_required is None:
            return self.permission_required
        else:
            return "{}.add_{}".format(
                self.model._meta.app_label,
                self.model._meta.object_name
            )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["fieldsets"] = self.fieldsets

        return context

    def get_template_names(self):

        template = "admin/{app}/{model}/detail.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/detail.html",
        ]


class AdminCreateView(StaffPermissionRequiredMixin, ContextMixin, CreateView):
    template_type = "centered"  # Options: fluid, centered

    def get_permission_required(self):
        if self.permission_required is None:
            return self.permission_required
        else:
            return "{}.add_{}".format(
                self.model._meta.app_label,
                self.model._meta.object_name
            )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get_template_names(self):

        template = "admin/{app}/{model}/form.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/form.html",
        ]

    def build_success_url(self):
        url_name = "{}-admin:{}-detail".format(
            self.model._meta.app_label,
            self.model._meta.model_name
        )
        return reverse(url_name, args=[self.object.id])

    def get_success_url(self):
        messages.success(
            self.request,
            '{} has been created.'.format(self.model._meta.verbose_name)
        )
        return self.build_success_url()


class AdminUpdateView(StaffPermissionRequiredMixin, ContextMixin, UpdateView):
    template_type = "centered"  # Options: fluid, centered

    def get_permission_required(self):
        if self.permission_required is None:
            return self.permission_required
        else:
            return "{}.change_{}".format(
                self.model._meta.app_label,
                self.model._meta.object_name
            )

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get_template_names(self):

        template = "admin/{app}/{model}/form.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/form.html",
        ]

    def build_success_url(self):
        url_name = "{}-admin:{}-detail".format(
            self.model._meta.app_label,
            self.model._meta.model_name
        )
        return reverse(url_name, args=[self.get_object().id])

    def get_success_url(self):
        messages.success(
            self.request,
            '{} has been updated.'.format(self.model._meta.verbose_name)
        )
        return self.build_success_url()


class AdminDeleteView(StaffPermissionRequiredMixin, ContextMixin, DeleteView):
    template_type = "centered"

    def get_permission_required(self):
        if self.permission_required is None:
            return self.permission_required
        else:
            return "{}.delete_{}".format(
                self.model._meta.app_label,
                self.model._meta.object_name
            )

    def build_success_url(self):
        url_name = "{}-admin:{}-list".format(
            self.model._meta.app_label,
            self.model._meta.model_name
        )
        return reverse(url_name)

    def get_success_url(self):
        messages.success(
            self.request,
            '{} has been deleted.'.format(self.model._meta.verbose_name)
        )
        return self.build_success_url()

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["template_type"] = self.template_type

        context["app_label"] = self.model._meta.app_label
        context["model_name"] = self.model._meta.model_name
        context["object_name"] = self.model._meta.object_name
        context["cancel_url"] = self.build_success_url()

        return context

    def get_template_names(self):

        template = "admin/{app}/{model}/confirm_delete.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/confirm_delete.html",
        ]


class AdminChildCreateView(ChildMixin, AdminCreateView):
    pass


class AdminChildUpdateView(ChildMixin, AdminUpdateView):
    pass


class AdminChildDeleteView(ChildMixin, AdminDeleteView):
    def get_template_names(self):

        template = "admin/{app}/{model}/child_confirm_delete.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/child_confirm_delete.html",
        ]
