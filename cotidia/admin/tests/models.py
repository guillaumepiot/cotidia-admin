from django.db import models

from cotidia.core.models import BaseModel


class ExampleModelOne(BaseModel):
    # Numeric Fields
    integer_field = models.IntegerField(null=True, blank=True)
    integer_choice_field = models.IntegerField(
        choices=((1, "Foo"), (2, "Bar")),
        null=True, blank=True
    )
    float_field = models.FloatField(null=True, blank=True)
    decimal_field = models.DecimalField(
        null=True, blank=True, max_digits=13, decimal_places=2
    )

    boolean_field = models.BooleanField()
    nullboolean_field = models.NullBooleanField(null=True, blank=True)

    # Text based fields
    char_field = models.CharField(max_length=50, null=True, blank=True)
    choice_field = models.CharField(
        max_length=50,
        choices=(("foo", "Foo"), ("bar", "Bar")),
        null=True, blank=True
    )
    text_field = models.TextField(null=True, blank=True)
    email_field = models.EmailField(null=True, blank=True)
    slug_field = models.SlugField(null=True, blank=True)

    # Date and time fields
    date_field = models.DateField(null=True, blank=True)
    datetime_field = models.DateTimeField(null=True, blank=True)
    time_field = models.TimeField(null=True, blank=True)
    duration_field = models.DurationField(null=True, blank=True)

    # Image fields
    models.ImageField(null=True, blank=True)

    # Foreign key fields
    other_model = models.ForeignKey(
        'tests.ExampleModelTwo',
        related_name="reverse",
        on_delete=models.SET_NULL, null=True, blank=True
    )
    many_to_many_field = models.ManyToManyField(
        'tests.ExampleModelTwo',
        blank=True
    )

    class SearchProvider:
        def serializer():
            from cotidia.admin.tests.serializers import ExampleModelOneSerializer
            return ExampleModelOneSerializer


class ExampleModelTwo(BaseModel):
    number = models.IntegerField(null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)
    other_model = models.ForeignKey(
        'tests.ExampleModelOne',
        related_name="reverse_related_models",
        null=True, blank=True,
        on_delete=models.SET_NULL
    )
