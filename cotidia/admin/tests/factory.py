import factory
import factory.fuzzy
from datetime import date, timedelta
from cotidia.admin.tests.models import GenericRecord

TEST_CHOICES = (
    ("opt1", "Option 1"),
    ("opt2", "Option 2"),
    ("opt3", "Option 3")
    )
INDEX = 0


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
    boolean_field = factory.fuzzy.FuzzyChoice([True,False])
