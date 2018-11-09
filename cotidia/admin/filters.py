import re
import datetime

from decimal import Decimal
from functools import reduce

from django.db.models import Q
from django.core.exceptions import FieldError
from django.conf import settings

from rest_framework.exceptions import ParseError

number_pattern = r'(\-?[0-9]+(?:\.[0-9]+)?)'

date_pattern = r'([0-9]{4}-[0-9]{2}-[0-9]{2})'

api_patterns = {
    'equal': r'^%s$',
    'lte': r'^:%s$',
    'gte': r'^%s:$',
    'range': r'^%s:%s$',
}


def filter_lte(field, val):
    return Q(**{field + '__lte': val})


def filter_gte(field, val):
    return Q(**{field + '__gte': val})


def filter_equal(field, val):
    return Q(**{field: val})


def filter_range(field, min_val, max_val):
    return filter_gte(field, min_val) & filter_lte(field, max_val)


def filter_comparable(field_regex, data_type):
    """Create a function that filters a value that matches a given regex."""

    def temp(field, val):
        match = re.match(api_patterns['equal'] % field_regex, val)

        if match:
            return filter_equal(field, data_type(match.group(1)))

        match = re.match(api_patterns['lte'] % field_regex, val)

        if match:
            return filter_lte(field, data_type(match.group(1)))

        match = re.match(api_patterns['gte'] % field_regex, val)

        if match:
            return filter_gte(field, data_type(match.group(1)))

        match = re.match(api_patterns['range'] % (field_regex, field_regex), val)

        if match:
            return filter_range(
                field,
                data_type(match.group(1)),
                data_type(match.group(2))
            )

        raise ParseError(
            detail='The following value could not be parsed: %s' % val
        )

    return temp

filter_number = filter_comparable(number_pattern, Decimal)

filter_date = filter_comparable(
    date_pattern,
    lambda x: datetime.datetime.strptime(x, '%Y-%m-%d').date()
)


def contains_filter(query_set, field, values):
    """Check if a field contains a value."""

    return field_filter(
        lambda x, y: Q(**{x + "__icontains": y}),
        query_set,
        field,
        values
    )


def exact_match_filter(query_set, field, values):
    """Check if a field exactly matches a value."""

    return field_filter(lambda x, y: Q(**{x: y}), query_set, field, values)


def boolean_filter(queryset, field, values):
    return field_filter(
        lambda x, y: Q(**{x: y == 'true'}),
        queryset,
        field,
        values
    )


def number_filter(query_set, field, values):
    """Check if a number fits a constraints."""

    return field_filter(filter_number, query_set, field, values)


def field_filter(filter_fn, queryset, field, values):
    """
    Filter the fields with a given function

    The function must return a Q-object
    """

    # Each value is "OR"ed against each other if it is a list.
    q_object = reduce(
        lambda x, y: x | y,
        [filter_fn(field, value) for value in values],
        Q(),
    )

    try:
        return queryset.filter(q_object)
    except FieldError:
        if settings.DEBUG:
            raise
        return queryset


def date_filter(query_set, field, values):
    return field_filter(filter_date, query_set, field, values)


def filter_general_query(
    serializer,
    values,
    queryset,
    query_fields,
    suffix='__icontains'
):
    q_object = Q()

    for val in values:
        # Turns all values in the field_set columns into Q objects and ORs them
        # together with the queryset for previous values
        q_object = reduce(
            lambda x, y: x | y,
            map(lambda x: Q(**{x + suffix: val}), query_fields),
            q_object
        )

    return queryset.filter(q_object)


FILTERS = {
    "text": contains_filter,
    "choice": exact_match_filter,
    "boolean": boolean_filter,
    "number": number_filter,
    "date": date_filter
}

class BaseFilter(object):
    field_name = None
    prefix = ""
    lookup_expr = ""
    query_param = ""
    field_type = ""
    label = ""
    default_q_obj = Q()

    def __init__(self, *args, **kwargs):
        self.field_name = kwargs.get("field_name", None)
        if kwargs.get("lookup_expr", False):
            self.lookup_expr = kwargs["lookup_expr"]

        if kwargs.get("prefix", False):
            self.prefix = kwargs["prefix"]

        if kwargs.get("query_param", False):
            self.query_param = kwargs["query_param"]

        if kwargs.get("label", False):
            self.label = kwargs["label"]
        else:
            self.label = self.field_name.replace(
                '__', ' '
            ).replace('_', ' ').title()
        if kwargs.get("default_q_obj", False):
            self.default_q_obj = kwargs["default_q_obj"]

    def parse_value(self, value):
        query_field = "{}{}{}".format(
            self.prefix,
            self.field_name,
            self.lookup_expr
        )
        return Q(**{ query_field: value })

    def get_q_object(self, values):
        assert(
            self.field_name is not None,
            "Need to include field name"
        )
        if values:
            q_obj = reduce(
                lambda x, y: x | y,
                [self.parse_value(val) for val in values],
                Q()
            )
        else:
            q_obj = self.default_q_obj

        return q_obj

    def annotate(self, queryset):
        return queryset

    def get_query_param(self):
        return self.prefix + (self.query_param or self.field_name)

    def filter(self, queryset, filter_params):
        return queryset

    def get_representation(self):
        return {
            "filter" : self.type,
            "queryParameter": self.get_query_param(),
            "label" : self.label,
        }

class ComparableFilter(BaseFilter):
    field_regex = None
    def data_type(self, value):
        return value

    def __init__(self, *args, **kwargs):
        if kwargs.get("field_regex", False):
            self.field_regex = self.kwargs["field_regex"]
        super().__init__(*args, **kwargs)

    def parse_value(self, value):
        assert(
            self.field_regex is not None,
            "Please specify a regex for this field"
        )

        field_regex = self.field_regex
        match = re.match(api_patterns['equal'] % field_regex, value)

        if match:
            return Q(
                **{"{}{}".format(self.get_query_param(), self.lookup_expr): self.data_type(match.group(1))}
            )

        match = re.match(api_patterns['lte'] % field_regex, value)

        if match:
            return Q(
                **{
                    "{}{}{}{}".format(
                        self.prefix, self.field_name, self.lookup_expr, "__lte"
                    ): self.data_type(match.group(1))
                }
            )

        match = re.match(api_patterns['gte'] % field_regex, value)

        if match:
            return Q(
                **{
                    "{}{}{}{}".format(
                        self.prefix, self.field_name, self.lookup_expr, "__gte"
                    ): self.data_type(match.group(1))
                }
            )


        match = re.match(api_patterns['range'] % (field_regex, field_regex), value)

        if match:
            return Q(
                **{
                    "{}{}{}{}".format(
                        self.prefix, self.field_name, self.lookup_expr, "__gte"
                    ): self.data_type(match.group(1))
                }
            ) & Q(
                **{
                    "{}{}{}{}".format(
                        self.prefix, self.field_name, self.lookup_expr, "__lte"
                    ): self.data_type(match.group(2))
                }
            )
        return Q()

class DateTimeFilter(ComparableFilter):
    field_regex = r'([0-9]{4}-[0-9]{2}-[0-9]{2})'
    data_type = lambda self, x: datetime.datetime.strptime(x, '%Y-%m-%d').date()
    type="date"


class ContainsFilter(BaseFilter):
    type = "text"
    lookup_expr = "__icontains"

class ExactFilter(BaseFilter):
    type = "text"
    lookup_expr = "__iexact"

class NumericFilter(ComparableFilter):
    type = "number"
    field_regex = r'(\-?[0-9]+(?:\.[0-9]+)?)'
    data_type = Decimal

class BooleanFilter(BaseFilter):
    type = "boolean"
    def parse_value(self, value):
        if value == "true":
            return Q(
                **{"{}{}{}".format(
                    self.prefix, self.field_name,
                    self.lookup_expr
                ): True}
            )

        if value == "false":
            return Q(
                **{
                    "{}{}{}".format(
                        self.prefix, self.field_name, self.lookup_expr
                    ): False
                }
            )

        return Q()

class ChoiceFilter(BaseFilter):
    type="choice"
    options=None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.options = kwargs.get("options")

    def get_options(self):
        return self.options

    def get_representation(self):
        repr = super().get_representation()
        repr["configuration"] = {
            'mode': 'options',
            'options': self.get_options(),
        }
        return repr

class AlgoliaFilter(ChoiceFilter):
    algolia_indexes = None
    algolia_api_key = None
    algolia_app_id = None
    algolia_filters = []

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.algolia_filters = kwargs.get('algolia_filters', [])

        self.algolia_indexes = kwargs.get('algolia_indexes')
        self.algolia_api_key = kwargs.get('algolia_api_key')
        self.algolia_app_id = kwargs.get('algolia_app_id')

        if self.algolia_api_key is None:
            self.algolia_api_key = settings.ALGOLIA_SEARCH_API_KEY

        if self.algolia_app_id is None:
            self.algolia_app_id = settings.ALGOLIA["APPLICATION_ID"]

        if self.algolia_indexes is None:
            self.algolia_indexes = [settings.ALGOLIA_DEFAULT_INDEX]

    def get_representation(self):
        repr = super().get_representation()
        repr["configuration"] = {
            'mode': 'algolia',
            'algoliaConfig': {
                'appId': self.algolia_app_id,
                'apiKey': self.algolia_api_key,
                'indexes': self.algolia_indexes,
                'filters': self.algolia_filters,
            },
        }
        return repr

class APIFilter(ChoiceFilter):
    endpoint = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.endpoint = self.kwargs.get('endpoint', [])

    def get_representation(self):
        repr = super().get_representation()
        repr["configuration"] = {
            'mode': 'api',
            'endpoint': self.endpoint,
        }
        return repr

class ForeignKeyFilter(ChoiceFilter):
    model_class = None
    lookup_expr = "__uuid"
    def __init__(self, model_class=None, field=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if model_class:
            self.model_class = model_class
        elif field:
            self.model_class = field.Meta.model

    def get_options(self):
        return [
            {
                "label": self.get_model_label(model),
                "value": model.uuid
            } for model in self.get_queryset()
        ]

    def get_model_label(self, model):
        return str(model)

    def get_queryset(self):
        return self.model_class.objects.all()

    def get_representation(self):
        repr =  super().get_representation()
        repr["many"] = True
        return repr

class DefaultGeneralQueryFilter(BaseFilter):
    fields = None

    def __init__(self, fields, *args, **kwargs):
        self.fields = fields

    def get_q_object(self, values):
        q_obj = Q()
        for value in values:
            for field in self.fields:
                q_obj |= Q(**{field + '__icontains': value})
        return q_obj
