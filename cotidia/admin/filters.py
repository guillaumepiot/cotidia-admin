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
