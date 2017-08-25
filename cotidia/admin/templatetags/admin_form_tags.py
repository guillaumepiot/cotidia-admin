from django import template
from django import forms

register = template.Library()


@register.filter()
def is_select(field):
    return isinstance(field.field.widget, forms.Select)


@register.filter()
def is_checkbox(field):
    return isinstance(field.field.widget, forms.CheckboxInput)
