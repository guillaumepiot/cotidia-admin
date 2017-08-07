from datetime import datetime
from django import template
from django.template.exceptions import TemplateDoesNotExist
from django.template.loader import get_template

register = template.Library()


@register.filter()
def get_attr(object, column):
    return getattr(object, column)


@register.simple_tag(takes_context=True)
def render_column(context, column):
    template = 'admin/columns/{}.html'.format(column)

    try:
        t = context.template.engine.get_template(template)
    except TemplateDoesNotExist:
        if type(getattr(context['object'], column)) is datetime:
            template = 'admin/generic/list/column_value_date.html'
        else:
            template = 'admin/generic/list/column_value.html'

        t = context.template.engine.get_template(template)

    value = t.render(context)

    wrapper = get_template('admin/generic/list/column.html')

    return wrapper.render({'value': value})
