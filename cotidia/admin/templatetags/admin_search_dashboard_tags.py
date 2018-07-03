import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
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
    url_action,
    auth_token,
    default_columns=[],
    default_filters=[],
    default_order_by=None,
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

    if endpoint is None:
        endpoint = reverse(
            'generic-api:object-list',
            kwargs={
                "app_label": app_label,
                "model": model_name
            }
        )

    # Mandatory keys
    context = {
        'endpoint': endpoint,
        'auth_token': auth_token,
        'columns': columns,
        'default_columns': default_columns,
    }

    # Optional keys

    detail_url = serializer.get_option('detail_url')

    if not detail_url and app_label and model_name and url_action:
        # To future maintainers: sorry
        # This gets the url template by doing a reverse lookup on a url that fits convention
        # It passes a trash ID and then string replaces it with a template tag for js
        # TODO find a better way of doing this
        try:
            url_name = "{}-admin:{}-{}".format(app_label, model_name, url_action)
            detail_url = reverse(
                url_name,
                kwargs={"pk": 9999})
            detail_url = detail_url.replace("9999", ":id")
        except NoReverseMatch:
            detail_url = None
    else:
        detail_url = None

    if serializer.get_option('enable_detail_url', default=serializer.enable_detail_url):
        context['detail_url'] = detail_url

    if default_filters:
        context['default_filters'] = default_filters

    # Default ordering
    context['default_order_by'] = serializer.get_option(
        'default_order_by',
        default=default_order_by
    )
    context['primary_color'] = serializer.get_option(
        'primary_color',
        default='#00abd3'
    )

    context['date_format'] = serializer.get_option(
        'date_format',
        default='D MMM YYYY'
    )

    context['datetime_format'] = serializer.get_option(
        'datetime_format',
        default='D MMM YYYY @ HH:mm'
    )

    context['columns_configurable'] = serializer.get_option(
        'columns_configurable',
        default=True
    )

    if serializer.get_option('list_handling'):
        context['list_handling'] = serializer.get_option('list_handling')

    if serializer.get_option('extra_filters'):
        context['extra_filters'] = serializer.get_option('extra_filters')

    if serializer.get_option('toolbar_filters'):
        context['toolbar_filters'] = serializer.get_option('toolbar_filters')

    if serializer.get_option('sidebar_filters'):
        context['sidebar_filters'] = serializer.get_option('sidebar_filters')

    if serializer.get_option('categorise_by'):
        context['categorise_by'] = serializer.get_option('categorise_by')

    if serializer.get_option('list_fields'):
        context['list_fields'] = serializer.get_option('list_fields')

    context['batch_actions'] = serializer.get_option('batch_actions', default=batch_actions)

    return context


@register.filter(name='json')
def json_dumps(data):
    return json.dumps(data, cls=DjangoJSONEncoder)
