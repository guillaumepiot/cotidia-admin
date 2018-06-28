from rest_framework.test import APITestCase
from cotidia.admin.tests.serializers import ExampleModelOneSerializer
from cotidia.admin.tests.factory import ExampleModelTwoFactory


class FieldRepresentation(APITestCase):

    def test_integer_generation(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["integer_field"]["display"], "verbatim")
        self.assertEqual(field_repr["integer_field"]["filter"], "number")

    def test_integer_choice_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(
            field_repr["integer_choice_field"]["display"], "verbatim"
        )
        self.assertEqual(
            field_repr["integer_choice_field"]["filter"], "choice"
        )
        self.assertEqual(
            field_repr["integer_choice_field"]["options"],
            [
                {"label": "Foo", "value": 1},
                {"label": "Bar", "value": 2},
            ]
        )

    def test_float_generation(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["float_field"]["display"], "verbatim")
        self.assertEqual(field_repr["float_field"]["filter"], "number")

    def test_decimal_generation(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["decimal_field"]["display"], "verbatim")
        self.assertEqual(field_repr["decimal_field"]["filter"], "number")
    
    def test_char_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["char_field"]["display"], "verbatim")
        self.assertEqual(field_repr["char_field"]["filter"], "text")

    def test_choice_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["choice_field"]["display"], "verbatim")
        self.assertEqual(field_repr["choice_field"]["filter"], "choice")
        self.assertEqual(
            field_repr["choice_field"]["options"],
            [
                {"label":"Foo", "value":"foo"},
                {"label":"Bar", "value":"bar"},
            ]
        )

    def test_text_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["text_field"]["display"], "verbatim")
        self.assertEqual(field_repr["text_field"]["filter"], "text")

    def test_slug_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["slug_field"]["display"], "verbatim")
        self.assertEqual(field_repr["slug_field"]["filter"], "text")

    def test_email_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["email_field"]["display"], "link:mailto")
        self.assertEqual(field_repr["email_field"]["filter"], "text")
    
    def test_boolean_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["boolean_field"]["display"], "boolean")
        self.assertEqual(field_repr["boolean_field"]["filter"], "boolean")

    def test_nullboolean_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["nullboolean_field"]["display"], "boolean")
        self.assertEqual(field_repr["nullboolean_field"]["filter"], "boolean")

    def test_date_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["date_field"]["display"], "date")
        self.assertEqual(field_repr["date_field"]["filter"], "date")

    def test_datetime_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["datetime_field"]["display"], "datetime")
        self.assertEqual(field_repr["datetime_field"]["filter"], "date")

    def test_time_field(self):
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(field_repr["time_field"]["display"], "datetime")
        self.assertEqual(field_repr["time_field"]["filter"], "date")

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

        field_repr = TmpSerializer().get_field_representation()

        self.assertEqual(
            field_repr["integer_field"]["display"], "integer_field"
        )
        self.assertEqual(field_repr["other_model__id"]["display"], "other_model__id")
        self.assertEqual(field_repr["other_model__name"]["display"], "other_model__name")
        self.assertEqual(field_repr["other_model__number"]["display"], "other_model__number")
        self.assertEqual(field_repr["float_field"]["display"], "float_field")
        self.assertEqual(field_repr["decimal_field"]["display"], "decimal_field")
        self.assertEqual(field_repr["boolean_field"]["display"], "boolean_field")
        self.assertEqual(field_repr["nullboolean_field"]["display"], "nullboolean_field")
        self.assertEqual(field_repr["char_field"]["display"], "char_field")
        self.assertEqual(field_repr["text_field"]["display"], "text_field")
        self.assertEqual(field_repr["email_field"]["display"], "email_field")
        self.assertEqual(field_repr["slug_field"]["display"], "slug_field")
        self.assertEqual(field_repr["date_field"]["display"], "date_field")
        self.assertEqual(field_repr["datetime_field"]["display"], "datetime_field")
        self.assertEqual(field_repr["time_field"]["display"], "time_field")

    def test_overriding_field_representation_display(self):
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

        field_repr = TmpSerializer().get_field_representation()

        self.assertEqual(
            field_repr["integer_field"]["filter"],
            "integer_field"
        )
        self.assertEqual(
            field_repr["other_model__id"]["filter"], "other_model__id"
        )
        self.assertEqual(
            field_repr["other_model__name"]["filter"], "other_model__name"
        )
        self.assertEqual(
            field_repr["other_model__number"]["filter"], "other_model__number"
        )
        self.assertEqual(field_repr["float_field"]["filter"], "float_field")
        self.assertEqual(field_repr["decimal_field"]["filter"], "decimal_field")
        self.assertEqual(field_repr["boolean_field"]["filter"], "boolean_field")
        self.assertEqual(
            field_repr["nullboolean_field"]["filter"], "nullboolean_field"
        )
        self.assertEqual(field_repr["char_field"]["filter"], "char_field")
        self.assertEqual(field_repr["text_field"]["filter"], "text_field")
        self.assertEqual(field_repr["email_field"]["filter"], "email_field")
        self.assertEqual(field_repr["slug_field"]["filter"], "slug_field")
        self.assertEqual(field_repr["date_field"]["filter"], "date_field")
        self.assertEqual(field_repr["datetime_field"]
                         ["filter"], "datetime_field")
        self.assertEqual(field_repr["time_field"]["filter"], "time_field")
    
    def test_many_to_many_field(self):
        model1 = ExampleModelTwoFactory.create(name="Foo")
        model2 = ExampleModelTwoFactory.create(name="Bar")
        serializer = ExampleModelOneSerializer()
        field_repr = serializer.get_field_representation()
        self.assertEqual(
            field_repr["many_to_many_field"]["display"], "verbatim"
        )
        self.assertEqual(field_repr["many_to_many_field"]["filter"], "choice")
        self.assertIn(
            {"label": model1.name, "value": str(model1.uuid)},
            field_repr["many_to_many_field"]["options"],
        )
        self.assertIn(
            {"label": model2.name, "value": str(model2.uuid)},
            field_repr["many_to_many_field"]["options"],
        )
