import os

from django.apps import apps
from django.core.management import BaseCommand
from django.utils.six.moves import input
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe


def string_prompt(question, default=None):
    if default is not None:
        result = input("%s: (default=%s)" % (question, default))
    else:
        result = input("%s: " % question)
    if not result:
        result = default
        while not result:
            result = ("This input is required\n%s: " % question)
    return result


# The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Generates the boilerplate code for a given model"

    def handle(self, *args, **options):
        app_label = string_prompt("Please enter the app label")
        model_name = string_prompt("Please enter the model name")
        model_class = apps.get_app_config(app_label).get_model(model_name)
        # Gets the field names
        fields = map(
            lambda x: (x.verbose_name, x.name),
            filter(  # filters non-editable fields
                lambda x: x.editable,
                model_class._meta.get_fields()
            )
        )
        structure = [
            {
                "path": os.path.join(
                    app_label,
                    'views',
                    'admin',
                    model_name.lower()+".py"
                ),
                "template": "generation/views.py"
            },
            {
                "path": os.path.join(
                    app_label,
                    'forms',
                    'admin',
                    model_name.lower()+".py"
                ),
                "template": "generation/forms.py"
            },
            {
                "path": os.path.join(
                    app_label,
                    'tests',
                    'admin',
                    model_name.lower()+".py"
                ),
                "template": "generation/forms.py"
            },
            {
                "path": os.path.join(
                    app_label,
                    'urls',
                    'admin',
                    model_name.lower()+".py"
                ),
                "template": "generation/urls.py"
            },
        ]

        context = {
            "model_name": model_class.__name__,
            "model_verbose_name": model_class._meta.verbose_name,
            "app_label": app_label,
            "fields": list(fields)
            }

        for template in structure:
            if not os.path.exists(template["path"]):
                # Creates directorys if they do not exist
                os.makedirs(os.path.dirname(
                    template["path"]),
                    exist_ok=True
                )
                with open(template["path"], 'w') as f:
                    file_content = render_to_string(template["template"],
                                                    context)
                    f.write(file_content)
                    f.close()

