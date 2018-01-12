from django.apps import apps
from django.core.management import BaseCommand
from django.utils.six.moves import input

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


#The class must be named Command, and subclass BaseCommand
class Command(BaseCommand):
    # Show this when the user types help
    help = "Generates the boilerplate code for a given model"

    def handle(self, *args, **options):
        app_label = string_prompt("Please enter the app label")
        model_name = string_prompt("Please enter the model name")
        model_class = apps.get_app_config(app_label).get_model(model_name)
        self.stdout.write(self.style.SUCCESS('Your model is a "%s"' %
                                             str(model_class)))
        # Gets the field names
        fields = map(
            lambda x: {
                "name": x.name,
                "label": x.replace("_", " ").title()
            },
            model_class._meta.get_fields()
        )
        self.stdout.write(self.style.SUCCESS('Your model is a "%s"' %
                                             str(fields)))
