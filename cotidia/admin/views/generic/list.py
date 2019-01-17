import urllib

from django.views.generic import ListView

from django.contrib import messages
from django.http import HttpResponseRedirect

from cotidia.admin.mixins import StaffPermissionRequiredMixin
from cotidia.admin.views.mixin import ContextMixin
from cotidia.admin.forms import ActionForm
from cotidia.admin.templatetags.admin_list_tags import get_admin_url


class AdminListView(StaffPermissionRequiredMixin, ContextMixin, ListView):
    columns = ()
    paginate_by = 25
    template_type = "padded"  # Options: fluid, padded, centered
    filterset = None
    # TODO
    # Option to show or not the detail view from the list
    # detail_view = True
    add_view = True
    actions = []
    row_click_action = "detail"
    row_actions = ["view", "update", "delete"]
    group_by = False
    orderable = False  # 'arrow', 'drag'

    def get_permission_required(self, *args, **kwargs):
        perms = super().get_permission_required(*args, **kwargs)

        if perms is None:
            perms = "{}.add_{}".format(
                self.model._meta.app_label, self.model._meta.model_name
            )

        return perms

    def get_queryset(self):
        queryset = super().get_queryset()

        if self.filterset:
            self.filter = self.filterset(
                self.request.GET, queryset=queryset, request=self.request
            )

            queryset = self.filter.qs

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["columns"] = self.columns
        context["add_view"] = self.add_view
        context["row_click_action"] = self.row_click_action
        context["row_actions"] = self.row_actions
        context["group_by"] = self.group_by
        context["next"] = self.request.path
        context["total_results_count"] = self.get_queryset().count()

        if hasattr(self, "filter") and self.filter and self.filter.data:
            context["filter_data"] = self.filter.data.dict()

            if "page" in context["filter_data"]:
                del context["filter_data"]["page"]

            context["filter_params"] = urllib.parse.urlencode(context["filter_data"])

            context["next"] += "?" + context["filter_params"]

        context["next"] = urllib.parse.quote(context["next"])

        if self.actions:
            action_list = ()

            for action in self.actions:
                action_func = getattr(self, action)
                action_name = getattr(action_func, "action_name", action)

                action_list += ((action, action_name),)

            context["actions"] = {"form": ActionForm(action_list=action_list)}

        context["orderable"] = getattr(self, "orderable", None)
        context["filter"] = getattr(self, "filter", None)

        return context

    def get_template_names(self):

        if self.template_name is not None:
            return [self.template_name]

        template = "admin/{app}/{model}/list.html".format(
            app=self.model._meta.app_label, model=self.model._meta.model_name
        )

        return [template, "admin/generic/page/list.html"]

    def post(self, *args, **kwargs):
        action = self.request.POST.get("actions")
        action_items = self.request.POST.getlist("action_items")

        action_func = getattr(self, action)

        action_name = getattr(action_func, "action_name", action)

        for object_id in action_items:
            try:
                item = self.get_queryset().get(pk=object_id)
            except self.model.DoesNotExist:
                item = None

            if item:
                action_func(item)

        return HttpResponseRedirect(self.get_success_url(action_name))

    def build_success_url(self):
        if self.request.GET.get("next"):
            return self.request.GET["next"]

        return get_admin_url(
            self.model._meta.app_label, self.model._meta.model_name, "list"
        )

    def get_success_url(self, action):
        messages.success(
            self.request, "'{}' has been executed successfully.".format(action)
        )

        return self.build_success_url()
