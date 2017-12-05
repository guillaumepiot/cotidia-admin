from django import template
from django.template.exceptions import TemplateDoesNotExist
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.utils.safestring import mark_safe

from cotidia.admin.utils import get_model_structure

register = template.Library()


@register.simple_tag(takes_context=True)
def render_search_dashboard_config(
        context,
        content_type_id,
        app_label,
        url_type,
        api_token):

    model_class = ContentType.objects.get_for_id(content_type_id).model_class()
    endpoint = reverse(
            'generic-api:object-list',
            kwargs={"content_type_id": content_type_id}
            )

    model_name = model_class._meta.model_name
    if app_label and model_name and url_type:
        # To future maintainers: sorry
        # This gets the url template by doing a reverse lookup on a url that fits convention
        # It passes a trash ID and then string replaces it with a template tag for js
        # TODO find a better way of doing this
        url_name = "{}-admin:{}-{}".format(app_label, model_name, url_type)
        detail_endpoint = reverse(
                url_name,
                kwargs={"id": 9999})
        detail_endpoint = detail_endpoint.replace("9999", ":id")
    else:
        detail_endpoint = None

    context['variable_name'] = "field_data"
    context['data'] = mark_safe(get_model_structure(
            model_class,
            endpoint=endpoint,
            detail_endpoint=detail_endpoint,
            token=api_token
            ))

    template = context.template.engine.get_template(
            "admin/generic/utils/javascript_data.html"
            )
    return template.render(context)
