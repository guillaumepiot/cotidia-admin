# Cotidia Admin

A set of tools needed to create an admin user interface.

```console
$ pip install -e git+git@code.cotidia.com:cotidia/admin.git#egg=cotidia-admin
```

## Settings

Add `cotidia.admin` to your INSTALLED_APPS:

```python
INSTALLED_APPS=[
    ...
    "cotidia.admin",
]
```

Add generic urls:

```python
urlpatterns = [
    url(
        r'^admin/generic/',
        include('cotidia.admin.urls.admin', namespace="generic-admin")
    ),
    url(
        r'^api/generic/',
        include('cotidia.admin.urls.api', namespace="generic-api")
    ),
```]

Add context processor:

```python
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, "templates")],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                ....
                'cotidia.admin.context_processor.admin_settings',
            ],
            'debug': DEBUG,
        },
    },
]
```

