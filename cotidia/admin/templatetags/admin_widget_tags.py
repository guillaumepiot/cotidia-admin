from django import template

register = template.Library()


@register.inclusion_tag('admin/widgets/typeahead_search.html')
def widget_typeahead_search(
        form_action_url,
        lookup_url,
        placeholder,
        extra_form_group_classes=None):

    context = {
        'form_action_url': form_action_url,
        'lookup_url': lookup_url,
        'placeholder': placeholder,
        'form_action_url': form_action_url,
    }

    if extra_form_group_classes:
        context['extra_form_group_classes'] = extra_form_group_classes

    return context
