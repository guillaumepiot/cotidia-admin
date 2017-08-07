from django.core.urlresolvers import reverse


def admin_menu(context):
    request = context["request"]
    return [
        {
            "text": context["SITE_NAME"],
            "url": reverse("dashboard"),
        },
        {
            "icon": "wrench",
            "align_right": True,
            "nav_items": [
                {
                    "text": "Users",
                    "url": reverse("account-admin:user_list"),
                    "permissions": ["account.add_user", "account.change_user"],
                },
                {
                    "text": "Roles",
                    "url": reverse("account-admin:group_list"),
                    "permissions": ["perms.auth.add_group", "perms.auth.change_group"],
                }
            ]
        },
        {
            "text": str(request.user),
            "align_right": True,
            "nav_items": [
                {
                    "text": "Profile",
                    "url": reverse("account-admin:edit"),
                    "permissions": [],
                },
                {
                    "text": "Change password",
                    "url": reverse("account-admin:password_change"),
                    "permissions": [],
                }
            ]
        }
    ]


# def can_view_menu():
#     if url:
#         if perm == []:
#             return True

#         return auth(item.permissions)
#     else:
#         perms = [auth(subitem.permissions) or perm == [] for subitem in item.nav_items]
#         flatten(perms)
#         return True in perms

# admin_menu = gatherPermission(my_admin_menu)
