import re
from decimal import Decimal
import datetime

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.renderers import JSONRenderer
from rest_framework.pagination import LimitOffsetPagination

from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse

from cotidia.admin.utils import (
        get_fields_from_model,
        get_model_serializer_class
        )


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
filter_date = filter_comparable(date_pattern,
        lambda x: datetime.strptime(x, "%Y-%m-%d"))


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


FILTERS = {
        "text": contains_filter,
        "choice": exact_match_filter,
        "boolean": exact_match_filter,
        "number": number_filter,
        "date": date_filter
        }


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


class AdminSearchDashboardAPIView(ListAPIView):
    paginate_by = 1
    pagination_class = LimitOffsetPagination 

    def get_queryset(self):
        model_class = self.model_class
        # Gets the field meta data for the model
        field_data = get_fields_from_model(model_class)
        query_set = model_class.objects.all()

        # Applies filters for each field in get request
        for field in field_data.keys():
            filter_params = self.request.GET.getlist(field)
            # If there is a filter to apply
            if filter_params:
                # Get the relevant filter and apply it
                filter_type = field_data[field]['filter']
                query_set = FILTERS[filter_type](query_set, field, filter_params)

        ordering_params = self.request.GET.getlist("_order")
        return query_set.order_by(*ordering_params)

    def get_serializer_class(self):
        return get_model_serializer_class(self.model_class)

    @property
    def model_class(self):
        return ContentType.objects\
                .get_for_id(self.kwargs['content_type_id'])\
                .model_class()


