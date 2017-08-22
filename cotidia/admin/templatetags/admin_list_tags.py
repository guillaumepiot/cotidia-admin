from datetime import datetime
from django import template
from django.template.exceptions import TemplateDoesNotExist
from django.template.loader import get_template
from django.core.urlresolvers import reverse

register = template.Library()


@register.filter()
def get_attr(obj, column):

    # If the column is a display function, call it with the object as first
    # argument
    if callable(column):
        return column(obj)

    attr = getattr(obj, column)

    # If the object attribute is a method, call it
    if callable(attr):
        return attr()

    return attr


@register.simple_tag(takes_context=True)
def render_column(context, column):
    column_header, column_attr = column
    app_label = context["app_label"]
    model_name = context["model_name"]
    template = 'admin/{}/{}/columns/{}.html'.format(
        app_label, model_name, column_attr
    )

    try:
        t = context.template.engine.get_template(template)
    except TemplateDoesNotExist:
        if type(get_attr(context['object'], column_attr)) is datetime:
            template = 'admin/generic/list/column_value_date.html'
        elif type(get_attr(context['object'], column_attr)) is bool:
            template = 'admin/generic/list/column_value_bool.html'
        else:
            template = 'admin/generic/list/column_value.html'

        t = context.template.engine.get_template(template)

    context["column"] = column_attr
    value = t.render(context)

    wrapper = get_template('admin/generic/list/column.html')

    return wrapper.render({'value': value, 'column_header': column_header})


@register.simple_tag
def get_admin_url(app_label, model_name, obj):
    return reverse(
        "{}-admin:{}-detail".format(app_label, model_name),
        args=[obj.pk]
    )
