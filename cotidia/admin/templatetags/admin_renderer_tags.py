from django import template

from cotidia.admin.renderers import flatten_item as do_flatten_item

register = template.Library()


@register.filter
def flatten_item(value):
    if value:
        return do_flatten_item(value)

    return value


@register.filter
def get_dict_value(d, k):
    if d and k:
        return d.get(k, "")
