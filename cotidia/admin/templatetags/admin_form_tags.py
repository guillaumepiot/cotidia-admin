from django import template
from django import forms

from cotidia.admin.widgets import RadioButtonSelect

register = template.Library()


@register.filter()
def is_select(field):
    return isinstance(field.field.widget, forms.Select)


@register.filter()
def is_checkbox(field):
    return isinstance(field.field.widget, forms.CheckboxInput)


@register.filter()
def is_radio_button(field):
    return isinstance(field.field.widget, RadioButtonSelect)


