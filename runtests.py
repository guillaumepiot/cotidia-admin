#!/usr/bin/env python
import os
import sys

import django

from django.conf import settings

PACKAGE_ROOT = os.path.abspath(os.path.dirname(__file__))

DEFAULT_SETTINGS = dict(
    SITE_NAME="Admin test",
    INSTALLED_APPS=[
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.sites",
        "django.contrib.messages",
        "django.contrib.staticfiles",

        "django_otp",
        "django_otp.plugins.otp_static",
        "django_otp.plugins.otp_totp",
        "two_factor",

        "cotidia.admin",
        "cotidia.account",
        "cotidia.mail",
        "cotidia.file",
        "rest_framework",
        "rest_framework.authtoken",
        "cotidia.admin.tests"
    ],
    MIDDLEWARE=[
        "django.middleware.common.CommonMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django_otp.middleware.OTPMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
    ],
    TEMPLATES=[
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "APP_DIRS": True,
            "OPTIONS": {
                "debug": True,
                "context_processors": [
                    "django.template.context_processors.request",
                    "django.contrib.auth.context_processors.auth",
                ]
            }
        },
    ],
    DATABASES={
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": ":memory:"
        }
    },
    SITE_ID=1,
    SITE_URL="http://localhost:8000",
    APP_URL="http://localhost:8000",
    ROOT_URLCONF="cotidia.admin.tests.urls",
    SECRET_KEY="notasecret",
    AUTH_USER_MODEL="account.User",
    STATIC_URL='/static/',
    STATIC_ROOT=PACKAGE_ROOT,
    REST_FRAMEWORK={
        'DEFAULT_AUTHENTICATION_CLASSES': (
            'rest_framework.authentication.TokenAuthentication',
            'rest_framework.authentication.SessionAuthentication',
        ),
        'DEFAULT_PERMISSION_CLASSES': (
            'rest_framework.permissions.IsAuthenticated',
        ),
        'DEFAULT_RENDERER_CLASSES': (
            'rest_framework.renderers.JSONRenderer',
        ),
        'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.LimitOffsetPagination',
        'PAGE_SIZE': 10
    },
    FILE_UPLOAD_PATH='test-uploads/',
    PUBLIC_FILE_STORAGE='django.core.files.storage.DefaultStorage'
)


def runtests():
    settings.configure(**DEFAULT_SETTINGS)

    try:
        # Django <= 1.8
        from django.test.simple import DjangoTestSuiteRunner
        test_runner = DjangoTestSuiteRunner(verbosity=1)
    except ImportError:
        # Django >= 1.8
        django.setup()
        from django.test.runner import DiscoverRunner
        test_runner = DiscoverRunner(verbosity=1)

    failures = test_runner.run_tests(['cotidia'])
    if failures:
        sys.exit(failures)


if __name__ == "__main__":
    runtests()
