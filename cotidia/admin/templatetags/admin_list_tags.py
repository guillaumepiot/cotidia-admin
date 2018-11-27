from datetime import datetime
from django import template
from django.template.exceptions import TemplateDoesNotExist
from django.template.loader import get_template
from django.urls import reverse

from cotidia.admin.templatetags.admin_util_tags import get_attr

register = template.Library()


@register.simple_tag(takes_context=True)
def render_column(context, column):

    if len(column) == 3:
        column_header, column_attr, column_alias = column
    elif len(column) == 2:
        column_header, column_attr = column
        column_alias = column_attr

    app_label = context["app_label"]
    model_name = context["model_name"]
    template = "admin/{}/{}/columns/{}.html".format(app_label, model_name, column_alias)

    try:
        t = context.template.engine.get_template(template)
    except TemplateDoesNotExist:
        if type(get_attr(context["object"], column_attr)) is datetime:
            template = "admin/generic/list/column_value_date.html"
        elif type(get_attr(context["object"], column_attr)) is bool:
            template = "admin/generic/list/column_value_bool.html"
        else:
            template = "admin/generic/list/column_value.html"

        t = context.template.engine.get_template(template)

    context["column"] = column_attr
    value = t.render(context)

    wrapper = get_template("admin/generic/list/column.html")

    return wrapper.render({"value": value, "column_header": column_header})


@register.simple_tag
def get_admin_url(app_label, model_name, url_type, obj=None):
    if url_type in ["detail", "update", "delete"]:
        return reverse(
            "{}-admin:{}-{}".format(app_label, model_name, url_type), args=[obj.pk]
        )
    else:
        return reverse("{}-admin:{}-{}".format(app_label, model_name, url_type))


@register.simple_tag
def get_child_admin_url(app_label, model_name, url_type, parent, obj=None):
    if url_type in ["detail", "update", "delete"]:
        return reverse(
            "{}-admin:{}-{}".format(app_label, model_name, url_type),
            args=[parent.pk, obj.pk],
        )
    else:
        return reverse(
            "{}-admin:{}-{}".format(app_label, model_name, url_type), args=[parent.pk]
        )


@register.filter()
def is_list(obj):
    return isinstance(obj, list)
