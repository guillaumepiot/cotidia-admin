from django import template
from django.template.exceptions import TemplateDoesNotExist

from cotidia.admin.templatetags.admin_util_tags import get_attr

register = template.Library()


@register.simple_tag(takes_context=True)
def render_detail_field(context, obj, field_attrs):
    label = field_attrs["label"]
    field = field_attrs["field"]
    field_type = field_attrs.get("display_type")
    fields_split = field.split("__")
    value = obj
    for f in fields_split:
        value = get_attr(value, f)
    app_label = context["app_label"]
    model_name = context["model_name"]
    template = 'admin/{}/{}/detail/{}.html'.format(
        app_label, model_name, field
    )

    try:
        t = context.template.engine.get_template(template)
    except TemplateDoesNotExist:
        template = 'admin/generic/detail/field.html'

        t = context.template.engine.get_template(template)

    context["label"] = label
    context["value"] = value
    context["display_type"] = field_type

    return t.render(context)
