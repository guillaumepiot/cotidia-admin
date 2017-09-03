from django import template
from django.template.exceptions import TemplateDoesNotExist

from cotidia.admin.templatetags.admin_list_tags import get_attr

register = template.Library()


@register.simple_tag(takes_context=True)
def render_detail_field(context, obj, field):
    label = field["label"]
    field = field["field"]
    value = get_attr(obj, field)
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

    return t.render(context)
