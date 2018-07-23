from django.urls import path, include

app_name = 'tests-admin'

urlpatterns = [
    path('model1/',
        include('cotidia.admin.tests.urls.admin.examplemodelone')
    ),
    path('model2/',
        include('cotidia.admin.tests.urls.admin.examplemodeltwo')
    ),
]
