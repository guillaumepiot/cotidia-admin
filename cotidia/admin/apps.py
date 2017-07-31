from django.apps import AppConfig


class AdminConfig(AppConfig):
    name = "cotidia.admin"
    label = "admin"

    def ready(self):
        import cotidia.admin.signals
