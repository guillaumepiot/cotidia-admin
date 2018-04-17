import factory
import factory.fuzzy
from datetime import date, timedelta, datetime
from cotidia.admin.tests.models import GenericRecord, GenericRecordNoMeta, GenericRecordTwo

TEST_CHOICES = (
    ("opt1", "Option 1"),
    ("opt2", "Option 2"),
    ("opt3", "Option 3")
    )
INDEX = 0

class GenericRecordNoMetaFactory(factory.django.DjangoModelFactory):
    date_field = factory.fuzzy.FuzzyDate(date.today() - timedelta(weeks=5))
    class Meta:
        model = GenericRecordNoMeta


class GenericRecordNoMeta2Factory(factory.django.DjangoModelFactory):
    char_field = factory.fuzzy.FuzzyText(length=90)
    date_field = factory.fuzzy.FuzzyDate(date.today() - timedelta(weeks=5))
    class Meta:
        model = GenericRecordTwo


class GenericRecordFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = GenericRecord

    choice_field = factory.Iterator(
            iter(TEST_CHOICES),
            cycle=True, getter=(lambda x: x[0]))
    date_field = factory.fuzzy.FuzzyDate(date.today() - timedelta(weeks=5))
    numeric_field = factory.fuzzy.FuzzyInteger(999)
    char_field = factory.fuzzy.FuzzyText(length=90)
    text_field = factory.fuzzy.FuzzyText(length=98)
    boolean_field = factory.fuzzy.FuzzyChoice([True, False])
    foreign_key_field = factory.SubFactory(GenericRecordNoMetaFactory)

    @factory.post_generation
    def many_to_many_field(self, create, extracted, **kwargs):
        for i in range(3):
            self.many_to_many_field.add(GenericRecordNoMeta2Factory())
