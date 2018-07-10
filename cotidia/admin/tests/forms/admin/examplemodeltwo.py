from django import forms

from betterforms.forms import BetterModelForm

from cotidia.admin.tests.models import ExampleModelTwo


class ExampleModelTwoAddForm(BetterModelForm):

    class Meta:
        model = ExampleModelTwo
        fields = [
            "number",
            "name",
            "other_model",
        ]
        fieldsets = (
            ('info', {
                'fields': (
                    "number",
                    "name",
                    "other_model",
                ),
                'legend': 'Example Model Two details'
            }),
        )


class ExampleModelTwoUpdateForm(BetterModelForm):

    class Meta:
        model = ExampleModelTwo
        fields = [
            "number",
            "name",
            "other_model",
        ]
        fieldsets = (
            ('info', {
                'fields': (
                    "number",
                    "name",
                    "other_model",
                ),
                'legend': 'Example Model Two details'
            }),
        )
