import urllib

from django.views.generic import (
    ListView,
    DetailView,
    DeleteView,
    CreateView,
    UpdateView,
    View
)
from django.contrib import messages
from django.urls import reverse
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.contrib.contenttypes.models import ContentType
from django.views.generic.base import TemplateView
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models.deletion import ProtectedError

from cotidia.admin.mixins import StaffPermissionRequiredMixin
from cotidia.admin.views.mixin import ContextMixin, ChildMixin
from cotidia.admin.forms import ActionForm
from cotidia.admin.utils import search_objects, get_queryset
from cotidia.admin.renderers import render_to_csv, render_to_pdf


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
    row_click_action = "update"  # or "detail"
    row_actions = ["view", "update", "delete"]
    group_by = False
    orderable = False  # 'arrow', 'drag'

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
                queryset=queryset,
                request=self.request
            )
            queryset = self.filter.qs

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['columns'] = self.columns
        context['add_view'] = self.add_view
        context['row_click_action'] = self.row_click_action
        context['row_actions'] = self.row_actions
        context['group_by'] = self.group_by

        context['next'] = self.request.path

        if hasattr(self, 'filter') and self.filter and self.filter.data:
            context['filter_data'] = self.filter.data.dict()
            if 'page' in context['filter_data']:
                del context['filter_data']['page']
            context['filter_params'] = urllib.parse.urlencode(context['filter_data'])
            context['next'] += '?' + context['filter_params']

        context['next'] = urllib.parse.quote(context['next'])

        if self.actions:
            action_list = ()
            for action in self.actions:
                action_func = getattr(self, action)
                action_name = getattr(action_func, 'action_name', action)
                action_list += (action, action_name),
            context['actions'] = {
                'form': ActionForm(action_list=action_list)
            }

        context['orderable'] = getattr(self, 'orderable', None)
        context['filter'] = getattr(self, 'filter', None)
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

        if self.request.GET.get('next'):
            return self.request.GET['next']

        context = self.get_context_data()

        return context['list_url']

    def get_success_url(self, action):
        messages.success(
            self.request,
            '"{}" has been executed successfully.'.format(action)
        )
        return self.build_success_url()


class AdminGenericListView(StaffPermissionRequiredMixin, ContextMixin, TemplateView):
    group_by = False
    model = None
    template_type = "fluid"

    def get_model(self, *args, **kwargs):
        try:
            return ContentType.objects.get(
                app_label=kwargs['app_label'],
                model=kwargs['model']
            ).model_class()
        except ContentType.DoesNotExist:
            raise Exception(
                "Model with app label {} and model name {} does not exist.".format(
                    kwargs['app_label'],
                    kwargs['model']
                )
            )

    def get_template_names(self):
        template = 'admin/{app}/{model}/dynamic-list.html'.format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [
            template,
            'admin/generic/page/dynamic-list.html',
        ]

    def get_context_data(self, *args, **kwargs):
        self.model = self.get_model(*args, **kwargs)

        context = super().get_context_data(**kwargs)
        context['app_label'] = self.model._meta.app_label
        context['model_name'] = self.model._meta.model_name

        # Even though the serailizer is passed into the view as
        # `serializer_class` and is indeed a class when it's passed in, by
        # this time this code is running, it's an instance of the
        # serializer, so we'll call it `serializer` in the context.
        if self.kwargs.get('serializer_class'):
            context['serializer'] = self.kwargs['serializer_class']

        if self.kwargs.get('endpoint'):
            context['endpoint'] = self.kwargs['endpoint']

        if self.request.GET.get('_column'):
            context['default_colunms'] = self.request.GET.getlist('_column')

        if self.request.GET.get('_order'):
            context['default_order_by'] = self.request.GET.getlist('_order')

        # Generate list of all filters from GET parameters.
        filters = {}
        for key in self.request.GET:
            if key[0] != '_':
                filters[key] = self.request.GET.getlist(key)

        context['default_filters'] = filters

        return context


class AdminDetailView(StaffPermissionRequiredMixin, ContextMixin, DetailView):
    template_type = "centered"  # Options: fluid, centered
    fieldsets = []

    def get_object(self, queryset=None):
        try:
            if queryset is None:
                q = self.get_queryset()
            else:
                q = queryset

            key = self.kwargs.get('pk')

            q = q.filter(uuid=key)
            return q.get()
        except:
            return super().get_object(queryset)

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

        if self.request.GET.get('next'):
            context["next"] = self.request.GET['next']

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

        if self.request.GET.get('next'):
            context["next"] = self.request.GET['next']

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

        if self.request.GET.get('next'):
            return self.request.GET['next']

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

    def get_object(self, queryset=None):
        try:
            if queryset is None:
                q = self.get_queryset()
            else:
                q = queryset

            key = self.kwargs.get('pk')

            q = q.filter(uuid=key)
            return q.get()
        except:
            return super().get_object(queryset)

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

        if self.request.GET.get('next'):
            print(self.request.GET['next'])
            context['next'] = self.request.GET['next']

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

        if self.request.GET.get('next'):
            print(self.request.GET['next'])
            return self.request.GET['next']

        context = self.get_context_data()

        return context['list_url']

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

        if self.request.GET.get('next'):
            return self.request.GET['next']

        context = self.get_context_data()

        return context['list_url']

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

        if self.request.GET.get('next'):
            context['next'] = self.request.GET['next']

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

    def delete(self, request, *args, **kwargs):
        """Catch protected objects."""

        self.object = self.get_object()
        try:
            self.object.delete()
        except ProtectedError:
            messages.error(
                self.request,
                '{} can not be deleted because it has other objects depending on it.'.format(self.model._meta.verbose_name)
            )
            return self.get(request, *args, **kwargs)

        success_url = self.get_success_url()

        return HttpResponseRedirect(success_url)


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

    def search_objects(self, query):
        return search_objects(query)

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

        if self.request.GET.get('next'):
            context['next'] = self.request.GET['next']

        return context


class AdminGenericExportView(StaffPermissionRequiredMixin, View):
    """Export serialized data to a file."""

    def get(self, *args, **kwargs):
        model = kwargs['model']
        app_label = kwargs['app_label']
        serializer_class = kwargs.get('serializer_class', None)
        fmt = kwargs['format']

        model_class = ContentType.objects.get(
            app_label=app_label,
            model=model
        ).model_class()

        if not serializer_class:
            serializer_class = model_class.get_admin_serializer()

        qs = get_queryset(
            model_class,
            serializer_class=serializer_class,
            filter_args=self.request.GET
        )

        data = serializer_class(qs, many=True).data

        if fmt == 'csv':
            return render_to_csv(data)
        elif fmt == 'pdf':
            return render_to_pdf(data)

        response = HttpResponse("No format to render.")
        return response
