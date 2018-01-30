import json

from django import template
from django.urls import NoReverseMatch
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.utils.safestring import mark_safe

from cotidia.admin.utils import get_model_structure

register = template.Library()


@register.simple_tag(takes_context=True)
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
    endpoint=None
):
    model_class = ContentType.objects.get(
        app_label=app_label,
        model=model_name
    ).model_class()
    if endpoint is None:
        endpoint = reverse(
            'generic-api:object-list',
            kwargs={

                "app_label": app_label,
                "model": model_name
            }
        )

    model_name = model_class._meta.model_name
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

    return mark_safe(json.dumps(get_model_structure(
        model_class,
        endpoint=endpoint,
        detail_endpoint=detail_endpoint,
        token=api_token,
        default_columns=default_columns,
        default_filters=default_filters,
        default_order=default_order,
        batch_actions=batch_actions
    )))
