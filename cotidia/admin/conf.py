from django.conf import settings

from appconf import AppConf


class AdminConf(AppConf):
    # Enter a dict of apps in the order that you would like to appear in
    # the menu
    MENU_DEFINITION = {}

    # Pull menu from apps if not added in the menu definition
    SHOW_DEFAULT_MENU = True

    DETAIL_CURRENCY = "&pound;"
    MAX_SUBSERIALIZER_DEPTH = 4

    # A list of links to go to from the main menu
    SHORTCUTS = []
    SHORTCUTS_TEXT = "Add"

    # A list of models and fields to search globally
    GLOBAL_SEARCH = []

    # Menu header logo
    SITE_LOGO = None

    DEBUG = False

    class Meta:
        prefix = 'admin'
