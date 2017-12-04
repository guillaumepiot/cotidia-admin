from django.conf import settings


from appconf import AppConf


class AdminConf(AppConf):

    # Enter a dict of apps in the order that you would like to appear in
    # the menu
    MENU_DEFINITION = {}

    DETAIL_CURRENCY = "&pound;"

    class Meta:
        prefix = 'admin'
