import re
from decimal import Decimal
import datetime

from functools import reduce

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.pagination import LimitOffsetPagination

from django.db.models import Q, F
from django.contrib.contenttypes.models import ContentType

from cotidia.admin.utils import (
        get_fields_from_model,
        get_model_serializer_class
        )


PAGE_SIZE = 20
number_pattern = r"(\-?[0-9]+(?:\.[0-9]+)?)"
date_pattern = r"(\d{4}-[01]\d-[0-3]\d)"
api_patterns = {
        "equal": r"^%s$",
        "lte": r"^:%s$",
        "gte": r"^%s:$",
        "range": r"^%s:%s$"
        }


def filter_lte(field, val):
    return Q(**{field + "__lte": val})


def filter_gte(field, val):
    return Q(**{field + "__gte": val})


def filter_equal(field, val):
    return Q(**{field: val})


def filter_range(field, min_val, max_val):
    return filter_gte(field, min_val) & filter_lte(field, max_val)


def filter_comparable(field_regex, data_type):
    """ Creates a function that filters a value that matches the parameter regex """
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
            return filter_range(field, data_type(match.group(1)), data_type(match.group(2)))
        raise ParseError(
                detail="The following value could not be parsed: %s" % val)
    return temp


filter_number = filter_comparable(number_pattern, Decimal)
filter_date = filter_comparable(
        date_pattern,
        lambda x: datetime.strptime(x, "%Y-%m-%d")
)


def contains_filter(query_set, field, values):
    """ Checks if a field contains a value """
    return field_filter(
            lambda x, y: Q(**{x + "__icontains": y}), query_set, field, values)


def exact_match_filter(query_set, field, values):
    """ Checks if a field exactly matches a value """
    return field_filter(lambda x, y: Q(**{x: y}), query_set, field, values)


def number_filter(query_set, field, values):
    """ Checks if a number fits a constraints """
    return field_filter(filter_number, query_set, field, values)


def field_filter(filter_fn, query_set, field, values):
    """ Filters the fields with a given function 
        The function must return a Q-object
        Each value is "OR"ed against eachother """ 
    q_object = filter_fn(field, values.pop())
    for value in values:
        q_object |= filter_fn(field, value)
    return query_set.filter(q_object)


def date_filter(query_set, field, values):
    return field_filter(filter_number, query_set, field, values)


def filter_general_query(serializer, values, queryset, query_fields, suffix="__icontains"):
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


def parse_ordering(order_val):
    if order_val[0] == "-":
        return F(order_val[1:]).desc(nulls_last=True)
    else:
        return F(order_val).asc(nulls_last=True)


FILTERS = {
        "text": contains_filter,
        "choice": exact_match_filter,
        "boolean": exact_match_filter,
        "number": number_filter,
        "date": date_filter
        }


def get_sub_serializer(serializer,field):
    fields = field.split("__")
    sub_serializer = serializer()
    for f in fields:
        sub_serializer = sub_serializer.fields[f].child

    return sub_serializer 



class AdminOrderableAPIView(APIView):
    def post(self, *args, **kwargs):
        content_type_id = kwargs.get("content_type_id")
        object_id = kwargs.get("object_id")
        content_type = ContentType.objects.get_for_id(content_type_id)
        item = content_type.get_object_for_this_type(id=object_id)
        action = self.request.POST.get("action")

        if action == "move-up":
            item.move_up()
        elif action == "move-down":
            item.move_down()

        return Response(status=status.HTTP_200_OK)


class GenericAdminPaginationStyle(LimitOffsetPagination):
    default_limit = PAGE_SIZE


class AdminSearchDashboardAPIView(ListAPIView):
    pagination_class = GenericAdminPaginationStyle

    def get_queryset(self):
        model_class = self.model_class
        # Gets the field meta data for the model
        field_data = get_fields_from_model(model_class)
        query_set = model_class.objects.all()

        q_list = self.request.GET.getlist('_q')
        serializer = get_model_serializer_class(model_class)
        try:
            general_query_field_set = serializer.SearchProvider.general_query_fields
        except AttributeError:
            general_query_field_set = ["id"]
        query_set = filter_general_query(serializer, q_list, query_set, general_query_field_set)

        # Applies filters for each field in get request
        for field in field_data.keys():
            # If the field name is reserved (starts with _ we skip the filtering)
            if field[0] == '_':
                continue
            filter_params = self.request.GET.getlist(field)
            # If there is a filter to apply
            if filter_params:
                # Get the relevant filter and apply it
                suffix=""
                try:
                    print(field_data[field])
                    if field_data[field]['many']:
                        sub_serializer = get_sub_serializer(serializer, field)
                        suffix = "__" + sub_serializer.SearchProvider.display_field
                        print(suffix)
                except KeyError:
                    pass
                filter_type = field_data[field]['filter']
                query_set = FILTERS[filter_type](
                        query_set,
                        field + suffix,
                        filter_params
                        )

        ordering_params = self.request.GET.getlist("_order")
        ordering_params = map(parse_ordering, ordering_params)
        return query_set.order_by(*ordering_params)

    def get_serializer_class(self):
        return get_model_serializer_class(self.model_class)

    @property
    def model_class(self):
        return ContentType.objects\
                .get(
                        app_label=self.kwargs['app_label'],
                        model=self.kwargs['model']
                ).model_class()
