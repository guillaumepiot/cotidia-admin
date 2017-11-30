from django.db import models


TEST_CHOICES = (
    ("opt1", "Option 1"),
    ("opt2", "Option 2"),
    ("opt3", "Option 3")
    )


class GenericRecord(models.Model):
    choice_field = models.CharField(
            max_length=15, choices=TEST_CHOICES
            )
    date_field = models.DateField(auto_now=True)
    numeric_field = models.IntegerField(default=2)
    char_field = models.CharField(
            max_length=100
            )
    text_field = models.TextField()
    boolean_field = models.BooleanField()

    class __meta__:
        field_labels = {
                "choice_field": "Choice Field",
                "date_field": "Date Field"
                }
        default_fields = ["id", "char_field"]

class GenericRecordNoMeta(models.Model):
    choice_field = models.CharField(
            max_length=15, choices=TEST_CHOICES
            )
    date_field = models.DateField(auto_now=True)
    numeric_field = models.IntegerField(default=2)
    char_field = models.CharField(
            max_length=100
            )
    text_field = models.TextField()
