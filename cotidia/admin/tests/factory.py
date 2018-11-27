import factory
import factory.fuzzy

from cotidia.admin.tests.models import ExampleModelOne, ExampleModelTwo


class ExampleModelOneFactory(factory.django.DjangoModelFactory):
    boolean_field = False

    class Meta:
        model = ExampleModelOne


class ExampleModelTwoFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = ExampleModelTwo
