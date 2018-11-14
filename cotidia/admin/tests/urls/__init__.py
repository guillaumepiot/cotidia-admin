from django.urls import path, include

from cotidia.account.views.admin import dashboard

app_name = "tests"

urlpatterns = [
    path(
        'admin/generic/',
        include('cotidia.admin.urls.admin', namespace="generic-admin")
    ),
    path(
        'api/generic/',
        include('cotidia.admin.urls.api', namespace="generic-api")
    ),
    path(
        'account/',
        include('cotidia.account.urls.public', namespace="account-public")
    ),
    path(
        'api/account/',
        include('cotidia.account.urls.api', namespace="account-api")
    ),
    path(
        'admin/account/',
        include('cotidia.account.urls.admin', namespace="account-admin")
    ),
    path('admin/mail/', include('cotidia.mail.urls', namespace="mail-admin")),
    path('admin/demo/', include('cotidia.admin.tests.urls.admin', namespace="tests-admin")),
    path('api/admin/', include('cotidia.admin.tests.urls.api.dynamic_list', namespace="dynamic-api")),
    path('admin/', dashboard, name="dashboard"),

]
