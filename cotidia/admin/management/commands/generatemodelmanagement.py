import os

from django.apps import apps
from django.core.management import BaseCommand
from django.utils.six.moves import input
from django.template.loader import render_to_string
from django.utils.safestring import mark_safe

TEMP_FILE_LOCATION = "tmp.txt"


def string_prompt(question, default=None):
    if default is not None:
        result = input("%s: (default=%s)" % (question, default))
    else:
        result = input("%s: " % question)
    if not result:
        result = default
        while not result:
            result = "This input is required\n%s: " % question
    return result


# The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Generates the boilerplate code for a given model"

    def add_arguments(self, parser):
        parser.add_argument(
            "--model",
            nargs=2,
            help="The app label and model to generate code for seperated by a" " space",
            metavar=("app_label", "model_name"),
        )
        parser.add_argument(
            "--replace",
            nargs="+",
            help="The components you want to force replacement of even if"
            "the file exists",
        )
        parser.add_argument(
            "--hide-snippets",
            action="store_true",
            help="Do not show snippets in std-out",
        )
        parser.add_argument(
            "--exclude-fields",
            nargs="+",
            help="Removes fields from the list of fields used in views + forms etc",
        )

    def handle(self, *args, **options):
        if options.get("model"):
            app_label = options.get("model")[0]
            model_name = options.get("model")[1]
        else:
            app_label = string_prompt("Please enter the app label")
            model_name = string_prompt("Please enter the model name")

        model_class = apps.get_app_config(app_label).get_model(model_name)
        # Gets the field names
        fields = list(
            map(
                lambda x: (x.verbose_name, x.name),
                filter(  # filters non-editable fields
                    lambda x: x.editable, model_class._meta.get_fields()
                ),
            )
        )
        structure = [
            {
                "name": "views",
                "path": os.path.join(
                    app_label, "views", "admin", model_name.lower() + ".py"
                ),
                "template": "generation/views.py",
            },
            {
                "name": "forms",
                "path": os.path.join(
                    app_label, "forms", "admin", model_name.lower() + ".py"
                ),
                "template": "generation/forms.py",
            },
            {
                "name": "tests",
                "path": os.path.join(
                    app_label, "tests", "admin", "test_" + model_name.lower() + ".py"
                ),
                "template": "generation/tests.py",
            },
            {
                "name": "urls",
                "path": os.path.join(
                    app_label, "urls", "admin", model_name.lower() + ".py"
                ),
                "template": "generation/urls.py",
            },
        ]

        snippets = [
            {
                "snippet_name": "URL snippet: %s/urls/admin/%s.py"
                % (app_label, model_name.lower()),
                "template": "generation/snippets/url_snippet.py",
            },
            {
                "snippet_name": "Menu snippet: %s/menu.py" % app_label,
                "template": "generation/snippets/menu_snippet.py",
            },
        ]

        if options["exclude_fields"]:
            fields = [x for x in fields if x[1] not in options["exclude_fields"]]

        context = {
            "model_name": model_class.__name__,
            "model_verbose_name": model_class._meta.verbose_name,
            "app_label": app_label,
            "fields": fields,
        }

        replace_fields = options.get("replace", [])
        if replace_fields is None:
            replace_fields = []

        for template in structure:
            # checks if user has chosen to replace the template
            replace_file = template["name"] in replace_fields
            if replace_file or not os.path.exists(template["path"]):
                # Creates directorys if they do not exist
                os.makedirs(os.path.dirname(template["path"]), exist_ok=True)
                with open(template["path"], "w") as f:
                    file_content = render_to_string(template["template"], context)
                    f.write(file_content)
                    f.close()

                self.stdout.write("Created file %s" % template["path"])
            else:
                self.stdout.write(
                    "Skipping %s as file already exists" % template["path"]
                )

        if not options["hide_snippets"]:
            snippet_string = "\n=========\nSnippets\n=========\n"
            for snippet in snippets:
                name = snippet["snippet_name"]
                template = snippet["template"]
                snippet_string += "\n" + "=" * len(name) + "\n"
                snippet_string += name
                snippet_string += "\n" + "=" * len(name) + "\n"
                snippet_string += render_to_string(template, context)
                snippet_string += "\n\n"

            self.stdout.write(snippet_string)
