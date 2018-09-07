import importlib

from django import template
from django.template.loader import get_template
from django.apps import apps

from cotidia.admin.conf import settings

register = template.Library()


def can_view_item(context, item):
    """Check permission for a link or sublinks, only return True if allowed."""
    request = context["request"]
    # If there's a url, then we look up the matching permission
    if item.get("url"):
        perms = item.get("permissions", [])
        if perms == []:
            return True
        else:
            for perm in perms:
                if request.user.has_perm(perm):
                    return True
    # If it has sub items, then check it can access at least one item
    elif item.get("nav_items"):
        for subitem in item.get("nav_items"):
            return can_view_item(context, subitem)
    return False


def build_permitted_item(context, item):
    """Return permitted links and sublinks."""
    data = {}
    keys = ["text", "icon", "align_right", "url", "permissions"]
    for key in keys:
        if item.get(key):
            data[key] = item.get(key)
    if item.get("nav_items"):
        data["nav_items"] = []
        for subitem in item.get("nav_items"):
            if can_view_item(context, subitem):
                data["nav_items"].append(
                    build_permitted_item(context, subitem)
                )
    return data


def build_permitted_menu(context, menu, permitted_menu):
    """Build a menu with only the permitted links."""
    for item in menu:
        if can_view_item(context, item):
            permitted_menu.append(build_permitted_item(context, item))
    return permitted_menu


@register.simple_tag(takes_context=True)
def menu(context):
    """For each app, try to find an admin_menu function inside menu.py."""

    permitted_menu = []

    # Build a list of app string names
    app_name_list = [app.name for app in apps.get_app_configs()]

    # If we have an admin menu order specified, re-order accordingly

    processed_apps = []

    for section, section_apps in settings.ADMIN_MENU_DEFINITION.items():
        current_menu_count = len(permitted_menu)

        for app in section_apps:
            processed_apps.append(app)

            try:
                module = importlib.import_module("{}.menu".format(app))
                admin_menu = module.admin_menu
            except (ModuleNotFoundError, AttributeError):
                admin_menu = None

            if admin_menu:
                menu = admin_menu(context)
                permitted_menu = build_permitted_menu(context, menu, permitted_menu)

        if current_menu_count < len(permitted_menu):
            # Insert header before the new menu item
            permitted_menu.insert(current_menu_count, {'text': section})

    # Add en empty break for the remaining unordered apps
    permitted_menu.append({'text': ''})

    if settings.ADMIN_SHOW_DEFAULT_MENU:
        for app in app_name_list:
            if app not in processed_apps:
                try:
                    module = importlib.import_module("{}.menu".format(app))
                    admin_menu = module.admin_menu
                except (ModuleNotFoundError, AttributeError):
                    admin_menu = None

                if admin_menu:
                    menu = admin_menu(context)
                    permitted_menu = build_permitted_menu(context, menu, permitted_menu)

    context = context.flatten()
    context["menu"] = permitted_menu

    template = get_template('admin/menu/menu.html')
    return template.render(context)
