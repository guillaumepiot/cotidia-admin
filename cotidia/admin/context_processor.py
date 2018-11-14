from django.conf import settings


def admin_settings(request):
    data = {
        "SITE_URL": settings.SITE_URL,
        "SITE_NAME": settings.SITE_NAME,
        "ADMIN_SITE_LOGO": settings.ADMIN_SITE_LOGO,
        "ADMIN_DETAIL_CURRENCY": settings.ADMIN_DETAIL_CURRENCY,
        "ADMIN_SHORTCUTS": settings.ADMIN_SHORTCUTS,
        "ADMIN_SHORTCUTS_TEXT": settings.ADMIN_SHORTCUTS_TEXT,
        "ADMIN_GLOBAL_SEARCH": settings.ADMIN_GLOBAL_SEARCH,
        "ADMIN_SHOW_BRANDING": settings.ADMIN_SHOW_BRANDING,
        "DEBUG": settings.DEBUG,
        "ADMIN_DEBUG": settings.ADMIN_DEBUG
    }

    return data
