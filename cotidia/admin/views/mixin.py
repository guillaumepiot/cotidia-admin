from django.urls import reverse
from django.shortcuts import get_object_or_404
from django.contrib import messages
from django.urls.exceptions import NoReverseMatch

from cotidia.admin.templatetags.admin_list_tags import get_admin_url


class ContextMixin:
    def get_list_url(self):
        try:
            if hasattr(self.model, 'SearchProvider'):
                return reverse(
                    "generic-admin:list",
                    kwargs={
                        "app_label": self.model._meta.app_label,
                        "model": self.model._meta.model_name
                    }
                )
            else:
                return get_admin_url(
                    self.model._meta.app_label,
                    self.model._meta.model_name,
                    'list'
                )
        except NoReverseMatch:
            return None

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        context['app_label'] = self.model._meta.app_label
        context['model_name'] = self.model._meta.model_name
        context['object_name'] = self.model._meta.object_name
        context['verbose_name'] = self.model._meta.verbose_name
        context['verbose_name_plural'] = self.model._meta.verbose_name_plural
        context['http_referer'] = self.request.META.get("HTTP_REFERER")

        context['template_type'] = self.template_type

        context["list_url"] = self.get_list_url()

        if hasattr(self.model, 'SearchProvider'):
            context['list_type'] = 'dynamic'
        else:
            context['list_type'] = 'static'

        return context


class ChildMixin:
    def get_parent(self, *args, **kwargs):
        parent_id = kwargs['parent_id']

        return get_object_or_404(self.parent_model, id=parent_id)

    def get(self, *args, **kwargs):
        self.parent = self.get_parent(*args, **kwargs)

        return super().get(*args, **kwargs)

    def post(self, *args, **kwargs):
        self.parent = self.get_parent(*args, **kwargs)

        return super().post(*args, **kwargs)

    def get_context_data(self, *args, **kwargs):
        context = super().get_context_data(*args, **kwargs)

        context['parent'] = self.parent

        context['parent_app_label'] = self.parent_model._meta.app_label
        context['parent_model_name'] = self.parent_model._meta.model_name
        context['parent_object_name'] = self.parent_model._meta.object_name
        context['parent_verbose_name'] = self.parent_model._meta.verbose_name

        return context

    def build_success_url(self):
        url_name = '{}-admin:{}-detail'.format(
            self.parent_model._meta.app_label,
            self.parent_model._meta.model_name
        )

        return reverse(url_name, args=[self.parent.id])

    def get_success_url(self):
        messages.success(
            self.request,
            "{} has been updated.".format(self.model._meta.verbose_name)
        )

        return self.build_success_url()

    def form_valid(self, form):
        """Assign the parent instance automatically on save."""

        self.object = form.save(commit=False)

        setattr(self.object, self.parent_model_foreign_key, self.parent)

        self.object.save()

        return super().form_valid(form)

    def get_template_names(self):

        if self.template_name is not None:
            return [self.template_name]

        template = 'admin/{app}/{model}/child_form.html'.format(
            app=self.model._meta.app_label,
            model=self.model._meta.model_name
        )

        return [template, 'admin/generic/page/child_form.html']

    def get_list_url(self):
        if hasattr(self.parent_model, 'SearchProvider'):
            return reverse(
                'generic-admin:list',
                kwargs={
                    'app_label': self.parent_model._meta.app_label,
                    'model': self.parent_model._meta.model_name
                }
            )
        else:
            return get_admin_url(
                self.parent_model._meta.app_label,
                self.parent_model._meta.model_name,
                'list'
            )
