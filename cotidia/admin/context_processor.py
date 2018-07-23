from django.conf import settings


def admin_settings(request):
    data = {
        "SITE_URL": settings.SITE_URL,
        "SITE_NAME": settings.SITE_NAME,
        "ADMIN_DETAIL_CURRENCY": settings.ADMIN_DETAIL_CURRENCY,
        "ADMIN_SHORTCUTS": settings.ADMIN_SHORTCUTS,
        "ADMIN_SHORTCUTS_TEXT": settings.ADMIN_SHORTCUTS_TEXT,
        "ADMIN_GLOBAL_SEARCH": settings.ADMIN_GLOBAL_SEARCH,
        "DEBUG": settings.DEBUG,
        "ADMIN_DEBUG": settings.ADMIN_DEBUG
    }

    return data
