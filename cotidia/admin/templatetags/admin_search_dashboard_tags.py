import json

from django import template
from django.core.serializers.json import DjangoJSONEncoder
from django.urls import NoReverseMatch
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse
from django.utils.safestring import mark_safe

register = template.Library()


@register.inclusion_tag(
    'admin/partials/dynamic_list_config.html', takes_context=False
)
def render_search_dashboard_config(
    app_label,
    model_name,
    auth_token,
    serializer=None,
    endpoint=None,
    default_columns=None,
    default_order_by=None,
    default_filters=None,
    batch_actions=None,
):
    context = {
        'app_label': app_label,
        'model_name': model_name,
    }

    # Get model class and its corresponding serializer class.
    model = ContentType.objects.get(
        app_label=app_label,
        model=model_name
    ).model_class()

    if not serializer:
        # Double call here because `serializer()` gets the serializer class,
        # not an instance of it. So, we call `serializer()` to get the class
        # and then call *that* to instantiate it.

        # TODO: Refactor this so that the method is `get_serializer_class` or
        #       something like that.
        serializer = model.SearchProvider.serializer()()

    # Calculate API endpoint
    if not endpoint:
        endpoint = serializer.get_endpoint()

    # Calculate `default_columns`
    if not default_columns:
        default_columns = serializer.get_default_columns()

    # Calculate default_oder_by
    if not default_order_by:
        default_order_by = serializer.get_option('default_order_by')

    field_representation = serializer.get_field_representation()
    column_representation = {}
    filter_representation = {}
    for name, field in field_representation.items():
        column_representation[name] = field
        if field.get("filter") is not None:
            filter_representation[name] = {}
            filter_representation[name]["filter"] = field["filter"]
            column_representation[name]["filter"] = name
            filter_representation[name]["label"] = field["label"]
            if field.get("options"):
                filter_representation[name]["options"] = field["options"]
                query_param = (filter_representation.get("queryParameter") or name)
                filter_representation[name]["queryParameter"] = query_param

    extra_filters = serializer.get_option('extra_filters')
    if extra_filters:
        for name, field in serializer.get_option('extra_filters').items():
            filter_representation[name] = field

    context['verbose_name'] = model._meta.verbose_name
    context['verbose_name_plural'] = model._meta.verbose_name_plural

    context['columns'] = serializer.get_columns()
    context['default_columns'] = default_columns
    context['default_order_by'] = default_order_by
    context['default_filters'] = default_filters

    context['endpoint'] = endpoint
    context['auth_token'] = auth_token
    context['title'] = serializer.get_option('title', default=model._meta.verbose_name_plural.title())
    context['field_representation'] = column_representation
    context['filters'] = filter_representation
    context['detail_url'] = serializer.get_detail_url()

    # Get some config values
    context['primary_color'] = serializer.get_option('primary_color')
    context['date_format'] = serializer.get_option('date_format')
    context['datetime_format'] = serializer.get_option('datetime_format')
    context['week_day_start'] = serializer.get_option('week_day_start')
    context['table_striped'] = serializer.get_option('table_striped')
    context['columns_configurable'] = serializer.get_option(
        'columns_configurable'
    )

    # Stuff passed straight from the serializer.
    context['list_handling'] = serializer.get_option('list_handling')
    context['extra_filters'] = serializer.get_option('extra_filters')
    context['toolbar_filters'] = serializer.get_option('toolbar_filters')
    context['sidebar_filters'] = serializer.get_option('sidebar_filters')
    context['global_actions'] = serializer.get_option('global_actions')
    context['categorise_by'] = serializer.get_option('categorise_by')
    context['list_fields'] = serializer.get_option('list_fields')
    context['sidebar_starts_shown'] = serializer.get_option('sidebar_starts_shown')
    context['ignore_stored_config'] = serializer.get_option('ignore_stored_config')

    # Batch actions can be overridden by the caller, so allow for that.
    if batch_actions:
        context['batch_actions'] = batch_actions
    else:
        context['batch_actions'] = serializer.get_option('batch_actions')

    return context


@register.inclusion_tag(
    'admin/partials/dynamic_list_config.html', takes_context=False
)
def render_dynamic_list_config(
    app_label,
    model_name,
    auth_token,
    serializer=None,
    endpoint=None,
    default_columns=None,
    default_order_by=None,
    default_filters=None,
    batch_actions=None,
):
    context = {
        'app_label': app_label,
        'model_name': model_name,
    }

    # Get model class and its corresponding serializer class.
    model = ContentType.objects.get(
        app_label=app_label,
        model=model_name
    ).model_class()

    if not serializer:
        # Double call here because `serializer()` gets the serializer class,
        # not an instance of it. So, we call `serializer()` to get the class
        # and then call *that* to instantiate it.

        # TODO: Refactor this so that the method is `get_serializer_class` or
        #       something like that.
        serializer = model.SearchProvider.serializer()()

    # Calculate API endpoint
    if not endpoint:
        endpoint = serializer.get_endpoint()

    # Calculate `default_columns`
    if not default_columns:
        default_columns = serializer.get_default_columns()

    # Calculate default_oder_by
    if not default_order_by:
        default_order_by = serializer.get_option('default_order_by')

    context['verbose_name'] = model._meta.verbose_name
    context['verbose_name_plural'] = model._meta.verbose_name_plural

    context['columns'] = serializer.get_columns()
    context['filters'] = serializer.get_filter_representation()
    context['default_columns'] = default_columns
    context['default_order_by'] = default_order_by
    context['default_filters'] = default_filters

    context['endpoint'] = endpoint
    context['auth_token'] = auth_token
    context['title'] = serializer.get_option('title', default=model._meta.verbose_name_plural.title())
    context['field_representation'] = serializer.get_field_representation()
    context['detail_url'] = serializer.get_detail_url()

    # Get some config values
    context['primary_color'] = serializer.get_option('primary_color')
    context['date_format'] = serializer.get_option('date_format')
    context['datetime_format'] = serializer.get_option('datetime_format')
    context['week_day_start'] = serializer.get_option('week_day_start')
    context['table_striped'] = serializer.get_option('table_striped')
    context['columns_configurable'] = serializer.get_option(
        'columns_configurable'
    )

    # Stuff passed straight from the serializer.
    context['list_handling'] = serializer.get_option('list_handling')
    context['extra_filters'] = serializer.get_option('extra_filters')
    context['toolbar_filters'] = serializer.get_option('toolbar_filters')
    context['sidebar_filters'] = serializer.get_option('sidebar_filters')
    context['global_actions'] = serializer.get_option('global_actions')
    context['categorise_by'] = serializer.get_option('categorise_by')
    context['list_fields'] = serializer.get_option('list_fields')
    context['sidebar_starts_shown'] = serializer.get_option('sidebar_starts_shown')
    context['ignore_stored_config'] = serializer.get_option('ignore_stored_config')
    context['filter_suggest_configuration'] = serializer.get_option('filter_suggest_configuration')

    # Batch actions can be overridden by the caller, so allow for that.
    if batch_actions:
        context['batch_actions'] = batch_actions
    else:
        context['batch_actions'] = serializer.get_option('batch_actions')

    return context


@register.filter(name='json')
def json_dumps(data):
    return json.dumps(data, cls=DjangoJSONEncoder)
