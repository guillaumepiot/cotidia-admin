from django.conf import settings

from appconf import AppConf


class AdminConf(AppConf):

    # Enter a dict of apps in the order that you would like to appear in
    # the menu
    MENU_DEFINITION = {}

    DETAIL_CURRENCY = "&pound;"
    MAX_SUBSERIALIZER_DEPTH = 4

    # A list of links to go to from the main menu
    SHORTCUTS = []

    class Meta:
        prefix = 'admin'
