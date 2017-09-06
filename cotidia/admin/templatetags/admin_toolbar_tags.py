from django import template
from django.template.loader import get_template
from django.core.urlresolvers import reverse

register = template.Library()


@register.simple_tag(takes_context=True)
def toolbar_action_button(
        context, app_label, model_name, action, text, object_id=None
):

    actions = {
        "add": ("plus", "add", "add", "create"),
        "update": ("pencil", "change", "update", "change"),
        "delete": ("trash-o", "delete", "delete", "delete"),
    }

    if action not in actions.keys():
        raise Exception("Action is invalid.")

    permission = "{app_label}.{action}_{model_name}".format(
        app_label=app_label,
        model_name=model_name,
        action=actions[action][1]
    )

    url_name = "{app_label}-admin:{model_name}-{action}".format(
        app_label=app_label,
        model_name=model_name,
        action=actions[action][2]
    )
    if object_id:
        url = reverse(url_name, args=[object_id])
    else:
        url = reverse(url_name)

    return render_toolbar_button(
        context,
        url,
        text,
        permission,
        actions[action][0],
        actions[action][3]
    )


@register.simple_tag(takes_context=True)
def toolbar_custom_button(
    context, url, text, permission=None, icon=None, classname=None
):
    return render_toolbar_button(
        context, url, text, permission, icon, classname
    )


def render_toolbar_button(context, url, text, permission, icon, classname):
    if permission and \
            permission not in context["request"].user.get_all_permissions():
        return ""

    template = get_template('admin/generic/utils/toolbar_button.html')
    return template.render({
        "url": url,
        "text": text,
        "icon": icon,
        "classname": classname
    })
