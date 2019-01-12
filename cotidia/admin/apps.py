from django.apps import AppConfig


class AdminConfig(AppConfig):
    name = "cotidia.admin"
    label = "admin"
    # Hack to ignore Two Factor `PhoneDeviceAdmin` site registration
    default_site = "django.contrib.admin.sites.AdminSite"

    def ready(self):
        import cotidia.admin.signals
