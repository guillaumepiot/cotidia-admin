from django import forms

from betterforms.forms import BetterModelForm

from cotidia.admin.tests.models import ExampleModelOne


class ExampleModelOneAddForm(BetterModelForm):
    class Meta:
        model = ExampleModelOne
        fields = [
            "integer_field",
            "float_field",
            "decimal_field",
            "boolean_field",
            "nullboolean_field",
            "char_field",
            "text_field",
            "email_field",
            "slug_field",
            "date_field",
            "datetime_field",
            "time_field",
            "duration_field",
            "other_model",
            "many_to_many_field",
        ]
        fieldsets = (
            (
                "info",
                {
                    "fields": (
                        "integer_field",
                        "float_field",
                        "decimal_field",
                        "boolean_field",
                        "nullboolean_field",
                        "char_field",
                        "text_field",
                        "email_field",
                        "slug_field",
                        "date_field",
                        "datetime_field",
                        "time_field",
                        "duration_field",
                        "other_model",
                        "many_to_many_field",
                    ),
                    "legend": "Example Model One details",
                },
            ),
        )


class ExampleModelOneUpdateForm(BetterModelForm):
    class Meta:
        model = ExampleModelOne
        fields = [
            "integer_field",
            "float_field",
            "decimal_field",
            "boolean_field",
            "nullboolean_field",
            "char_field",
            "text_field",
            "email_field",
            "slug_field",
            "date_field",
            "datetime_field",
            "time_field",
            "duration_field",
            "other_model",
            "many_to_many_field",
        ]
        fieldsets = (
            (
                "info",
                {
                    "fields": (
                        "integer_field",
                        "float_field",
                        "decimal_field",
                        "boolean_field",
                        "nullboolean_field",
                        "char_field",
                        "text_field",
                        "email_field",
                        "slug_field",
                        "date_field",
                        "datetime_field",
                        "time_field",
                        "duration_field",
                        "other_model",
                        "many_to_many_field",
                    ),
                    "legend": "Example Model One details",
                },
            ),
        )
