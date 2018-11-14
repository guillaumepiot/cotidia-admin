from django.test import TestCase, override_settings
from django.db.models import Q

from cotidia.admin.filters import (
    BaseFilter,
)


class FieldRepresentationTests(TestCase):
    def test_default_q_obj(self):
        f = BaseFilter(
            field_name="field_name",
            prefix="prefix__",
            lookup_expr="__lookup_expr",
            field_type="verbatim",
            label="test",
            default_q_obj=Q(foo="bar")
        )
        q_obj = f.get_q_object([])
        self.assertEqual(q_obj, Q(foo="bar"))
