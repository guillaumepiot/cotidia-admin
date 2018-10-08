from django.test import TestCase
from cotidia.admin.serializers import BaseDynamicListSerializer
from cotidia.admin.tests.models import ExampleModelOne, ExampleModelTwo
from cotidia.admin.filters import (
    ExactFilter,
    ContainsFilter,
    DateTimeFilter,
    NumericFilter,
    BooleanFilter,
    ChoiceFilter,
    ForeignKeyFilter,
)

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
    def test_all_field_generation(self):
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
        serializer = ExampleModelOneSerializer()
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("integer_field", serializer.get_filters().keys())
        self.assertIn("integer_choice_field", serializer.get_filters().keys())
        self.assertIn("float_field", serializer.get_filters().keys())
        self.assertIn("decimal_field", serializer.get_filters().keys())
        self.assertIn("boolean_field", serializer.get_filters().keys())
        self.assertIn("nullboolean_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("choice_field", serializer.get_filters().keys())
        self.assertIn("text_field", serializer.get_filters().keys())
        self.assertIn("email_field", serializer.get_filters().keys())
        self.assertIn("slug_field", serializer.get_filters().keys())
        self.assertIn("date_field", serializer.get_filters().keys())
        self.assertIn("datetime_field", serializer.get_filters().keys())
        self.assertIn("time_field", serializer.get_filters().keys())
        self.assertIn("many_to_many_field", serializer.get_filters().keys())
        self.assertIn("other_model", serializer.get_filters().keys())
        self.assertIn("other_model__name", serializer.get_filters().keys())
        self.assertIn("other_model__number", serializer.get_filters().keys())

    def test_exclude_field_generation(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelTwoSerializer()

            many_to_many_field = ExampleModelTwoSerializer(many=True)

            class Meta:
                model = ExampleModelOne
                exclude = ["uuid", "duration_field"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field", "text_field", "slug_field"]
                exclude_filters = ['integer_field']
        serializer = ExampleModelOneSerializer()
        self.assertNotIn("integer_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("integer_choice_field", serializer.get_filters().keys())
        self.assertIn("float_field", serializer.get_filters().keys())
        self.assertIn("decimal_field", serializer.get_filters().keys())
        self.assertIn("boolean_field", serializer.get_filters().keys())
        self.assertIn("nullboolean_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("choice_field", serializer.get_filters().keys())
        self.assertIn("text_field", serializer.get_filters().keys())
        self.assertIn("email_field", serializer.get_filters().keys())
        self.assertIn("slug_field", serializer.get_filters().keys())
        self.assertIn("date_field", serializer.get_filters().keys())
        self.assertIn("datetime_field", serializer.get_filters().keys())
        self.assertIn("time_field", serializer.get_filters().keys())
        self.assertIn("many_to_many_field", serializer.get_filters().keys())
        self.assertIn("other_model", serializer.get_filters().keys())
        self.assertIn("other_model__name", serializer.get_filters().keys())
        self.assertIn("other_model__number", serializer.get_filters().keys())

    def test_exclude_foreign_key_field_generation(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelTwoSerializer()

            many_to_many_field = ExampleModelTwoSerializer(many=True)

            class Meta:
                model = ExampleModelOne
                exclude = ["uuid", "duration_field"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field", "text_field", "slug_field"]
                exclude_filters = ['other_model']
        serializer = ExampleModelOneSerializer()
        self.assertIn("integer_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("integer_choice_field", serializer.get_filters().keys())
        self.assertIn("float_field", serializer.get_filters().keys())
        self.assertIn("decimal_field", serializer.get_filters().keys())
        self.assertIn("boolean_field", serializer.get_filters().keys())
        self.assertIn("nullboolean_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("choice_field", serializer.get_filters().keys())
        self.assertIn("text_field", serializer.get_filters().keys())
        self.assertIn("email_field", serializer.get_filters().keys())
        self.assertIn("slug_field", serializer.get_filters().keys())
        self.assertIn("date_field", serializer.get_filters().keys())
        self.assertIn("datetime_field", serializer.get_filters().keys())
        self.assertIn("time_field", serializer.get_filters().keys())
        self.assertIn("many_to_many_field", serializer.get_filters().keys())
        self.assertNotIn("other_model", serializer.get_filters().keys())
        self.assertNotIn("other_model__name", serializer.get_filters().keys())
        self.assertNotIn("other_model__number", serializer.get_filters().keys())

    def test_exclude_foreign_key_sub_filter_generation(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelTwoSerializer()

            many_to_many_field = ExampleModelTwoSerializer(many=True)

            class Meta:
                model = ExampleModelOne
                exclude = ["uuid", "duration_field"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field", "text_field", "slug_field"]
                exclude_filters = ['other_model__name']
        serializer = ExampleModelOneSerializer()
        self.assertIn("integer_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("integer_choice_field", serializer.get_filters().keys())
        self.assertIn("float_field", serializer.get_filters().keys())
        self.assertIn("decimal_field", serializer.get_filters().keys())
        self.assertIn("boolean_field", serializer.get_filters().keys())
        self.assertIn("nullboolean_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("choice_field", serializer.get_filters().keys())
        self.assertIn("text_field", serializer.get_filters().keys())
        self.assertIn("email_field", serializer.get_filters().keys())
        self.assertIn("slug_field", serializer.get_filters().keys())
        self.assertIn("date_field", serializer.get_filters().keys())
        self.assertIn("datetime_field", serializer.get_filters().keys())
        self.assertIn("time_field", serializer.get_filters().keys())
        self.assertIn("many_to_many_field", serializer.get_filters().keys())
        self.assertIn("other_model", serializer.get_filters().keys())
        self.assertNotIn("other_model__name", serializer.get_filters().keys())
        self.assertIn("other_model__number", serializer.get_filters().keys())

    def test_explicit_filter_generation(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelTwoSerializer()

            many_to_many_field = ExampleModelTwoSerializer(many=True)

            class Meta:
                model = ExampleModelOne
                exclude = ["uuid", "duration_field"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field", "text_field", "slug_field"]
                filters = [
                    'integer_field',
                    'char_field'
                ]
        serializer = ExampleModelOneSerializer()
        self.assertIn("integer_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertNotIn("integer_choice_field", serializer.get_filters().keys())
        self.assertNotIn("float_field", serializer.get_filters().keys())
        self.assertNotIn("decimal_field", serializer.get_filters().keys())
        self.assertNotIn("boolean_field", serializer.get_filters().keys())
        self.assertNotIn("nullboolean_field", serializer.get_filters().keys())
        self.assertNotIn("choice_field", serializer.get_filters().keys())
        self.assertNotIn("text_field", serializer.get_filters().keys())
        self.assertNotIn("email_field", serializer.get_filters().keys())
        self.assertNotIn("slug_field", serializer.get_filters().keys())
        self.assertNotIn("date_field", serializer.get_filters().keys())
        self.assertNotIn("datetime_field", serializer.get_filters().keys())
        self.assertNotIn("time_field", serializer.get_filters().keys())
        self.assertNotIn("many_to_many_field", serializer.get_filters().keys())
        self.assertNotIn("other_model", serializer.get_filters().keys())
        self.assertNotIn("other_model__name", serializer.get_filters().keys())
        self.assertNotIn("other_model__number", serializer.get_filters().keys())

    def test_explicit_filter_generation_foreign_key(self):
        class ExampleModelOneSerializer(BaseDynamicListSerializer):
            other_model = ExampleModelTwoSerializer()

            many_to_many_field = ExampleModelTwoSerializer(many=True)

            class Meta:
                model = ExampleModelOne
                exclude = ["uuid", "duration_field"]

            class SearchProvider:
                display_field = "char_field"
                general_query_fields = ["char_field", "text_field", "slug_field"]
                filters = [
                    'integer_field',
                    'char_field',
                    "other_model__number"
                ]
        serializer = ExampleModelOneSerializer()
        self.assertIn("integer_field", serializer.get_filters().keys())
        self.assertIn("char_field", serializer.get_filters().keys())
        self.assertIn("other_model__number", serializer.get_filters().keys())
        self.assertNotIn("integer_choice_field", serializer.get_filters().keys())
        self.assertNotIn("float_field", serializer.get_filters().keys())
        self.assertNotIn("decimal_field", serializer.get_filters().keys())
        self.assertNotIn("boolean_field", serializer.get_filters().keys())
        self.assertNotIn("nullboolean_field", serializer.get_filters().keys())
        self.assertNotIn("choice_field", serializer.get_filters().keys())
        self.assertNotIn("text_field", serializer.get_filters().keys())
        self.assertNotIn("email_field", serializer.get_filters().keys())
        self.assertNotIn("slug_field", serializer.get_filters().keys())
        self.assertNotIn("date_field", serializer.get_filters().keys())
        self.assertNotIn("datetime_field", serializer.get_filters().keys())
        self.assertNotIn("time_field", serializer.get_filters().keys())
        self.assertNotIn("many_to_many_field", serializer.get_filters().keys())
        self.assertNotIn("other_model", serializer.get_filters().keys())
        self.assertNotIn("other_model__name", serializer.get_filters().keys())
    
    def test_filter_repr_keys_same(self):
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
        serializer = ExampleModelOneSerializer()    
        self.assertEqual(
            set(serializer.get_filters().keys()),
            set(serializer.get_filter_representation().keys())
        )
    
    def test_contains_filter_repr(self):
        f = ContainsFilter(field_name="field_name", prefix="prefix__")
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "text")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")


    def test_exact_filter_repr(self):
        f = ExactFilter(field_name="field_name", prefix="prefix__")
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "text")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")
    
    def test_date_time_filter_repr(self):
        f = DateTimeFilter(field_name="field_name", prefix="prefix__")
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "date")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")

    def test_numeric_filter_repr(self):
        f = NumericFilter(field_name="field_name", prefix="prefix__")
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "number")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")

    def test_numeric_filter_repr(self):
        f = NumericFilter(field_name="field_name", prefix="prefix__")
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "number")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")

    def test_boolean_filter_repr(self):
        f = BooleanFilter(field_name="field_name", prefix="prefix__")
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "boolean")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")

    def test_boolean_filter_repr(self):
        f = ChoiceFilter(field_name="field_name", prefix="prefix__", options=(
            (1,2),
            (2,3),
            (3,4),
        ))
        representation = f.get_representation()
        self.assertEqual(representation["filter"], "choice")
        self.assertEqual(representation["queryParameter"], "prefix__field_name")
        self.assertEqual(representation["options"], (
            (1,2),
            (2,3),
            (3,4),
        ))
    BooleanFilter,
    ChoiceFilter,
    ForeignKeyFilter,