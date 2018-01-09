from django.views.generic import (
    ListView,
    DetailView,
    DeleteView,
    CreateView,
    UpdateView,
    View
)
from django.contrib import messages
from django.urls import reverse, NoReverseMatch
from django.http import HttpResponseRedirect, Http404
from django.contrib.contenttypes.models import ContentType
from django.views.generic.base import TemplateView
from django.apps import apps
from django.db.models import Q
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from cotidia.admin.mixins import StaffPermissionRequiredMixin
from cotidia.admin.views.mixin import ContextMixin, ChildMixin
from cotidia.admin.forms import ActionForm
from cotidia.admin.templatetags.admin_list_tags import get_admin_url
from cotidia.admin.conf import settings


class AdminListView(StaffPermissionRequiredMixin, ContextMixin, ListView):
    columns = ()
    paginate_by = 25
    template_type = "fluid"  # Options: fluid, centered
    filterset = None
    # TODO
    # Option to show or not the detail view from the list
    # detail_view = True
    add_view = True
    actions = []
    row_click_action = "update"  # or "detail"
    row_actions = ["view", "update", "delete"]

    def get_permission_required(self):
        if hasattr(self, "permission_required"):
            return self.permission_required
        else:
            return "{}.add_{}".format(
                self.model._meta.app_label,
                self.model._meta.model_name
            )

    def get_queryset(self):

        queryset = super().get_queryset()

        if self.filterset:
            self.filter = self.filterset(
                self.request.GET,
                queryset=queryset
            )
            queryset = self.filter.qs

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["columns"] = self.columns
        context["add_view"] = self.add_view
        context["row_click_action"] = self.row_click_action
        context["row_actions"] = self.row_actions

        if self.actions:
            action_list = ()
            for action in self.actions:
                action_func = getattr(self, action)
                action_name = getattr(action_func, "action_name", action)
                action_list += (action, action_name),
            context["actions"] = {
                "form": ActionForm(action_list=action_list)
            }

        context["filter"] = getattr(self, "filter", None)

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

    def post(self, *args, **kwargs):
        action = self.request.POST.get("actions")
        action_items = self.request.POST.getlist("action_items")
        action_func = getattr(self, action)
        action_name = getattr(action_func, "action_name", action)

        for object_id in action_items:
            item = self.get_queryset().get(pk=object_id)
            action_func(item)

        return HttpResponseRedirect(self.get_success_url(action_name))

    def build_success_url(self):
        url_name = "{}-admin:{}-list".format(
            self.model._meta.app_label,
            self.model._meta.model_name
        )
        return reverse(url_name)

    def get_success_url(self, action):
        messages.success(
            self.request,
            '"{}" has been executed successfully.'.format(action)
        )
        return self.build_success_url()


class AdminGenericListView(StaffPermissionRequiredMixin, TemplateView):

    def get_template_names(self):

        template = "admin/{app}/{model}/dynamic-list.html".format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            "admin/generic/page/dynamic-list.html",
        ]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        try:
            content_type_id = ContentType.objects.get(app_label=kwargs["app_label"], model=kwargs["model"]).id
        except ContentType.DoesNotExist:
            raise Http404()

        self.model = ContentType.objects.get_for_id(content_type_id).model_class()
        app_label = self.model._meta.app_label
        model_name = self.model._meta.model_name

        # Checks if there is an "add url"
        try:
            get_admin_url(app_label, model_name, "add")
            add_view = True
        except NoReverseMatch:
            add_view = False

        filters = {}
        for key in self.request.GET:
            if key[0] != '_':
                filters[key] = self.request.GET.getlist(key)


        url_type = "detail"
        context["content_type_id"] = content_type_id
        context["verbose_name"] = self.model._meta.verbose_name
        context["verbose_name_plural"] = self.model._meta.verbose_name_plural
        context["add_view"] = add_view
        context["app_label"] = app_label
        context["model_name"] = model_name
        context["url_type"] = url_type
        # context["list"] = self.model.model_has_search_provider
        context["default_columns"] = self.request.GET.getlist("_column")
        context["default_order"] = self.request.GET.getlist("_order")
        context["default_filters"] = filters

        try:
            reverse("{}-admin:{}-{}".format(app_label, model_name, url_type),
                    kwargs={"id": "1"})
            context["app_label"] = app_label
            context["model_name"] = model_name
            context["url_type"] = url_type
        except NoReverseMatch:
            pass

        # Has add view?
        try:
            reverse("{}-admin:{}-{}".format(app_label, model_name, "add"))
            context["add_view"] = True
        except:
            context["add_view"] = False

        return context


class AdminDetailView(StaffPermissionRequiredMixin, ContextMixin, DetailView):
    template_type = "centered"  # Options: fluid, centered
    fieldsets = []

    def get_permission_required(self):
        if hasattr(self, "permission_required"):
            return self.permission_required
        else:
            return "{}.add_{}".format(
                self.model._meta.app_label,
                self.model._meta.model_name
            )

    def get_fieldsets(self):
        return self.fieldsets

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context["fieldsets"] = self.get_fieldsets()

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
        if hasattr(self, "permission_required"):
            return self.permission_required
        else:
            return "{}.add_{}".format(
                self.model._meta.app_label,
                self.model._meta.model_name
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
    # TODO
    # fixed actions bar

    def get_permission_required(self):
        if hasattr(self, "permission_required"):
            return self.permission_required
        else:
            return "{}.change_{}".format(
                self.model._meta.app_label,
                self.model._meta.model_name
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
        url_name = "{}-admin:{}-list".format(
            self.model._meta.app_label,
            self.model._meta.model_name
        )
        return reverse(url_name)

    def build_detail_url(self):
        url_name = "{}-admin:{}-detail".format(
            self.model._meta.app_label,
            self.model._meta.model_name
        )
        return reverse(url_name, args=[self.get_object().id])

    def get_success_url(self):
        messages.success(
            self.request,
            '{} has been updated. <a href="{}">View</a>'.format(
                self.model._meta.verbose_name,
                self.build_detail_url()
            )
        )
        return self.build_success_url()


class AdminDeleteView(StaffPermissionRequiredMixin, ContextMixin, DeleteView):
    template_type = "centered"

    def get_permission_required(self):
        if hasattr(self, "permission_required"):
            return self.permission_required
        else:
            return "{}.delete_{}".format(
                self.model._meta.app_label,
                self.model._meta.model_name
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


class AdminOrderableView(View):
    def post(self, *args, **kwargs):
        content_type_id = kwargs.get("content_type_id")
        object_id = kwargs.get("object_id")
        content_type = ContentType.objects.get_for_id(content_type_id)
        item = content_type.get_object_for_this_type(id=object_id)
        action = self.request.POST.get("action")

        if action == "move-up":
            item.move_up()
        elif action == "move-down":
            item.move_down()

        messages.success(
            self.request,
            "Item has been reordered."
        )

        return HttpResponseRedirect(self.request.META["HTTP_REFERER"])

    def get(self, *args, **kwargs):
        self.request.POST = self.request.GET
        return self.post(*args, **kwargs)


class AdminGenericSearchView(StaffPermissionRequiredMixin, TemplateView):

    template_name = "admin/generic/page/search.html"

    def get_item_url(self, model, obj):
        url_name = "{}-admin:{}-detail".format(
            model._meta.app_label,
            model._meta.model_name
        )
        return reverse(url_name, kwargs={"pk": obj.id})

    def search_objects(self, query):
        results = []

        if not query:
            return []

        for m in settings.ADMIN_GLOBAL_SEARCH:
            app_label, model_name = m["model"].split(".")
            model = apps.get_model(app_label, model_name)

            q_objects = Q()

            for field in m["fields"]:
                for q in query.split(" "):
                    filter_args = {}
                    lookup = "__icontains"
                    filter_args[field + lookup] = q
                    q_objects.add(Q(**filter_args), Q.OR)

            for item in model.objects.filter(q_objects):
                results.append({
                    "type": model._meta.verbose_name,
                    "representation": item.__str__(),
                    "url": self.get_item_url(model, item)
                })

        return results

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        query = self.request.GET.get("query")
        context["global_search_query"] = query

        objects = self.search_objects(query)

        paginator = Paginator(objects, 25)

        page = self.request.GET.get('page')

        try:
            page_obj = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            page_obj = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            page_obj = paginator.page(paginator.num_pages)

        context["object_list"] = page_obj.object_list
        context["num_results"] = paginator.count
        context["page_obj"] = page_obj

        context["url_params"] = "query={}&".format(query)
        return context
