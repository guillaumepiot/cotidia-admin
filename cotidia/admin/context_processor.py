from cotidia.account.conf import settings


def admin_settings(request):

    data = {
        "SITE_URL": settings.SITE_URL,
        "SITE_NAME": settings.SITE_NAME
    }

    return data
