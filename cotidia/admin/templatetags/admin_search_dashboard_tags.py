import json

from django import template
from django.urls import NoReverseMatch
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.utils.safestring import mark_safe

from cotidia.admin.utils import get_model_structure

register = template.Library()


@register.inclusion_tag(
    'admin/partials/search_dashboard_config.html', takes_context=True
)
def render_search_dashboard_config(
    context,
    app_label,
    model_name,
    url_type,
    api_token,
    default_columns=[],
    default_filters=[],
    default_order=[],
    batch_actions=[],
    serializer_class=None,
    endpoint=None
):
    model_class = ContentType.objects.get(
        app_label=app_label,
        model=model_name
    ).model_class()
    if serializer_class is None:
        serializer = model_class.SearchProvider.serializer()()
    else:
        serializer = serializer_class
    if endpoint is None:
        endpoint = reverse(
            'generic-api:object-list',
            kwargs={

                "app_label": app_label,
                "model": model_name
            }
        )
    
    columns = serializer.get_field_representation()
    default_columns = serializer.get_default_columns()

    if app_label and model_name and url_type:
        # To future maintainers: sorry
        # This gets the url template by doing a reverse lookup on a url that fits convention
        # It passes a trash ID and then string replaces it with a template tag for js
        # TODO find a better way of doing this
        try:
            url_name = "{}-admin:{}-{}".format(app_label, model_name, url_type)
            detail_endpoint = reverse(
                url_name,
                kwargs={"pk": 9999})
            detail_endpoint = detail_endpoint.replace("9999", ":id")
        except NoReverseMatch:
            detail_endpoint = None
    else:
        detail_endpoint = None
    if endpoint is None:
        endpoint = reverse(
            'generic-api:object-list',
            kwargs={
                "app_label": app_label,
                "model": model_name
            }
        )

    context =  {
        "columns": columns,
        "default_columns": default_columns,
        "endpoint": endpoint,
        "list_fields": serializer.get_list_fields()
    }

    if detail_endpoint is not None:
        context['detail_endpoint'] = detail_endpoint
    if api_token is not None:
        context['auth_token'] = api_token
    if default_columns:
        context['default_columns'] = default_columns
    if default_filters:
        context['default_filters'] = default_filters
    if default_order:
        context['default_order_by'] = default_order[0]
    context['list_handling'] = serializer.get_global_list_handling()

    return context

@register.filter(name='json')
def json_dumps(data):
    return json.dumps(data)