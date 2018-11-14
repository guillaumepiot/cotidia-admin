from django.test import TestCase
from cotidia.admin.serializers import BaseDynamicListSerializer
from cotidia.admin.tests.models import ExampleModelOne, ExampleModelTwo
from cotidia.admin.tests.factory import ExampleModelTwoFactory


class ExampleModelTwoSerializer(BaseDynamicListSerializer):
    class Meta:
        model = ExampleModelTwo
        exclude = ["uuid", "other_model"]

    class SearchProvider:
        display_field = "name"
        filters = '__all__'


class ExampleModelOneSerializer(BaseDynamicListSerializer):
    other_model = ExampleModelTwoSerializer()

    many_to_many_field = ExampleModelTwoSerializer(many=True)

    class Meta:
        model = ExampleModelOne
        exclude = ["uuid", "duration_field"]

    class SearchProvider:
        display_field = "char_field"
        general_query_fields = ["char_field", "text_field", "slug_field"]
        filters = '__all__'


class FieldRepresentationTests(TestCase):
    def test_integer_generation(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["integer_field"]["display"], "verbatim")
        self.assertEqual(field_repr["integer_field"]["filter"], "integer_field")

    def test_integer_choice_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(
            field_repr["integer_choice_field"]["display"], "verbatim"
        )

        self.assertEqual(
            field_repr["integer_choice_field"]["filter"], "integer_choice_field"
        )


    def test_float_generation(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["float_field"]["display"], "verbatim")
        self.assertEqual(field_repr["float_field"]["filter"], "float_field")

    def test_decimal_generation(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["decimal_field"]["display"], "verbatim")
        self.assertEqual(field_repr["decimal_field"]["filter"], "decimal_field")

    def test_char_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["char_field"]["display"], "verbatim")
        self.assertEqual(field_repr["char_field"]["filter"], "char_field")

    def test_choice_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["choice_field"]["display"], "verbatim")
        self.assertEqual(field_repr["choice_field"]["filter"], "choice_field")

    def test_text_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["text_field"]["display"], "verbatim")
        self.assertEqual(field_repr["text_field"]["filter"], "text_field")

    def test_slug_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["slug_field"]["display"], "verbatim")
        self.assertEqual(field_repr["slug_field"]["filter"], "slug_field")

    def test_email_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["email_field"]["display"], "link:mailto")
        self.assertEqual(field_repr["email_field"]["filter"], "email_field")

    def test_boolean_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["boolean_field"]["display"], "boolean")
        self.assertEqual(field_repr["boolean_field"]["filter"], "boolean_field")

    def test_nullboolean_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["nullboolean_field"]["display"], "boolean")
        self.assertEqual(
            field_repr["nullboolean_field"]["filter"], "nullboolean_field"
        )

    def test_date_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["date_field"]["display"], "date")
        self.assertEqual(field_repr["date_field"]["filter"], "date_field")

    def test_datetime_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["datetime_field"]["display"], "datetime")
        self.assertEqual(field_repr["datetime_field"]["filter"], "datetime_field")

    def test_time_field(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(field_repr["time_field"]["display"], "datetime")
        self.assertEqual(field_repr["time_field"]["filter"], "time_field")

    def test_sub_serializer(self):
        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertIn("other_model__id", field_repr.keys())
        self.assertIn("other_model__name", field_repr.keys())
        self.assertIn("other_model__number", field_repr.keys())

    def test_overriding_field_representation_display(self):
        class TmpSerializer(ExampleModelOneSerializer):
            class SearchProvider:
                field_representation = {
                    "integer_field": {
                        "display": "integer_field"
                    },
                    "other_model__id": {
                        "display": "other_model__id"
                    },
                    "other_model__name": {
                        "display": "other_model__name"
                    },
                    "other_model__number": {
                        "display": "other_model__number"
                    },
                    "float_field": {
                        "display": "float_field"
                    },
                    "decimal_field": {
                        "display": "decimal_field"
                    },
                    "boolean_field": {
                        "display": "boolean_field"
                    },
                    "nullboolean_field": {
                        "display": "nullboolean_field"
                    },
                    "char_field": {
                        "display": "char_field"
                    },
                    "text_field": {
                        "display": "text_field"
                    },
                    "email_field": {
                        "display": "email_field"
                    },
                    "slug_field": {
                        "display": "slug_field"
                    },
                    "date_field": {
                        "display": "date_field"
                    },
                    "datetime_field": {
                        "display": "datetime_field"
                    },
                    "time_field": {
                        "display": "time_field"
                    },
                }
                filters = '__all__'

        field_repr = TmpSerializer().get_field_representation()

        self.assertEqual(
            field_repr["integer_field"]["display"],
            "integer_field"
        )
        self.assertEqual(
            field_repr["other_model__id"]["display"],
            "other_model__id"
        )
        self.assertEqual(
            field_repr["other_model__name"]["display"],
            "other_model__name"
        )
        self.assertEqual(
            field_repr["other_model__number"]["display"],
            "other_model__number"
        )
        self.assertEqual(
            field_repr["float_field"]["display"],
            "float_field"
        )
        self.assertEqual(
            field_repr["decimal_field"]["display"],
            "decimal_field"
        )
        self.assertEqual(
            field_repr["boolean_field"]["display"],
            "boolean_field"
        )
        self.assertEqual(
            field_repr["nullboolean_field"]["display"],
            "nullboolean_field"
        )
        self.assertEqual(
            field_repr["char_field"]["display"],
            "char_field"
        )
        self.assertEqual(
            field_repr["text_field"]["display"],
            "text_field"
        )
        self.assertEqual(
            field_repr["email_field"]["display"],
            "email_field"
        )
        self.assertEqual(
            field_repr["slug_field"]["display"],
            "slug_field"
        )
        self.assertEqual(
            field_repr["date_field"]["display"],
            "date_field"
        )
        self.assertEqual(
            field_repr["datetime_field"]["display"],
            "datetime_field"
        )
        self.assertEqual(
            field_repr["time_field"]["display"],
            "time_field"
        )

    def test_overriding_field_representation_filter(self):
        class TmpSerializer(ExampleModelOneSerializer):
            class SearchProvider:
                field_representation = {
                    "integer_field": {
                        "filter": "integer_field"
                    },
                    "other_model__id": {
                        "filter": "other_model__id"
                    },
                    "other_model__name": {
                        "filter": "other_model__name"
                    },
                    "other_model__number": {
                        "filter": "other_model__number"
                    },
                    "float_field": {
                        "filter": "float_field"
                    },
                    "decimal_field": {
                        "filter": "decimal_field"
                    },
                    "boolean_field": {
                        "filter": "boolean_field"
                    },
                    "nullboolean_field": {
                        "filter": "nullboolean_field"
                    },
                    "char_field": {
                        "filter": "char_field"
                    },
                    "text_field": {
                        "filter": "text_field"
                    },
                    "email_field": {
                        "filter": "email_field"
                    },
                    "slug_field": {
                        "filter": "slug_field"
                    },
                    "date_field": {
                        "filter": "date_field"
                    },
                    "datetime_field": {
                        "filter": "datetime_field"
                    },
                    "time_field": {
                        "filter": "time_field"
                    },
                }
                filters = '__all__'

        field_repr = TmpSerializer().get_field_representation()

        self.assertEqual(
            field_repr["integer_field"]["filter"],
            "integer_field"
        )
        self.assertEqual(
            field_repr["other_model__id"]["filter"],
            "other_model__id"
        )
        self.assertEqual(
            field_repr["other_model__name"]["filter"],
            "other_model__name"
        )
        self.assertEqual(
            field_repr["other_model__number"]["filter"],
            "other_model__number"
        )
        self.assertEqual(
            field_repr["float_field"]["filter"],
            "float_field"
        )
        self.assertEqual(
            field_repr["decimal_field"]["filter"],
            "decimal_field"
        )
        self.assertEqual(
            field_repr["boolean_field"]["filter"],
            "boolean_field"
        )
        self.assertEqual(
            field_repr["nullboolean_field"]["filter"],
            "nullboolean_field"
        )
        self.assertEqual(
            field_repr["char_field"]["filter"],
            "char_field"
        )
        self.assertEqual(
            field_repr["text_field"]["filter"],
            "text_field"
        )
        self.assertEqual(
            field_repr["email_field"]["filter"],
            "email_field"
        )
        self.assertEqual(
            field_repr["slug_field"]["filter"],
            "slug_field"
        )
        self.assertEqual(
            field_repr["date_field"]["filter"],
            "date_field"
        )
        self.assertEqual(
            field_repr["datetime_field"]["filter"],
            "datetime_field"
        )
        self.assertEqual(
            field_repr["time_field"]["filter"],
            "time_field"
        )

    def test_many_to_many_field(self):
        model1 = ExampleModelTwoFactory.create(name="Foo")

        model2 = ExampleModelTwoFactory.create(name="Bar")

        serializer = ExampleModelOneSerializer()

        field_repr = serializer.get_field_representation()

        self.assertEqual(
            field_repr["many_to_many_field"]["display"],
            "verbatim"
        )
        self.assertEqual(
            field_repr["many_to_many_field"]["filter"],
            "many_to_many_field"
        )

    def test_get_related_fields_fields(self):
        serializer = ExampleModelOneSerializer()

        related_fields = serializer.get_related_fields()

        self.assertEqual(related_fields, ["other_model"])

