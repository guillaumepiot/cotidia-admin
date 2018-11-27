from django.test import TestCase
from cotidia.admin.tests.serializers import (
    CustomSerializer,
    CustomColumnSerializer,
    CustomColumnChildSerializer,
)


class ColumnsTests(TestCase):
    def test_columns_default(self):
        columns = CustomSerializer().get_columns()

        expected_columns = [
            {
                "label": "Columns",
                "columns": [
                    "created_at",
                    "id",
                    "modified_at",
                    "name",
                    "number",
                    "other_model",
                ],
            }
        ]
        self.assertEqual(columns, expected_columns)

    def test_columns_declared(self):
        columns = CustomColumnSerializer().get_columns()

        expected_columns = [
            {
                "label": "Other model",
                "columns": ["other_model", "other_model__number", "other_model__name"],
            },
            {"label": "Model one", "columns": ["integer_field", "boolean_field"]},
        ]

        self.assertEqual(columns, expected_columns)

    def test_columns_only_applies_for_parent(self):
        """Test that Sub-serializers columns should not apply if used as a child."""

        # Test child serialzer own column declaration
        columns = CustomColumnChildSerializer().get_columns()
        expected_columns = [{"label": "Number", "columns": ["number"]}]
        self.assertEqual(columns, expected_columns)

        # Test parent serialzer own column declaration
        columns = CustomColumnSerializer().get_columns()
        expected_columns = [
            {
                "label": "Other model",
                "columns": ["other_model", "other_model__number", "other_model__name"],
            },
            {"label": "Model one", "columns": ["integer_field", "boolean_field"]},
        ]
        self.assertEqual(columns, expected_columns)
