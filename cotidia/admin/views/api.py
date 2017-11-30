import re
from decimal import Decimal

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
from rest_framework.pagination import LimitOffsetPagination 

from django.db.models import Q
from django.contrib.contenttypes.models import ContentType
from django.urls import reverse

from cotidia.admin.utils import get_fields_from_model


number_pattern = r"(\-?[0-9]+(?:\.[0-9]+)?)"
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
    print(val)
    return Q(**{field: val})


def filter_range(field, min_val, max_val):
    return filter_gte(field, min_val) & filter_lte(field, max_val)


def filter_number(field, val):
    match = re.match(api_patterns['equal'] % number_pattern, val)
    if match:
        print("Groups Equal")
        print(match.group(1))
        return filter_equal(field, Decimal(match.group(1)))
    match = re.match(api_patterns['lte'] % number_pattern, val)
    if match:
        print("Groups GTE")
        print(match.group())
        return filter_lte(field, Decimal(match.group(1)))
    match = re.match(api_patterns['gte'] % number_pattern, val)
    if match:
        print("Groups LTE")
        print(match.group(1))
        return filter_gte(field, Decimal(match.group(1)))
    match = re.match(api_patterns['range'] % (number_pattern, number_pattern), val)
    if match:
        print("Groups range")
        print(match.group(1))
        print(match.group(2))
        return filter_range(field, Decimal(match.group(1)), Decimal(match.group(2)))
    raise ParseError(
            detail="The following value is not correct for a numeric field: %s" % val)


def text_filter(query_set, field, values):
    field += "__icontains"
    q_object = Q(**{field: values.pop()})
    for value in values:
        q_object |= Q(**{field: value})
    return query_set.filter(q_object)


def choice_filter(query_set, field, values):
    q_object = Q(**{field: values.pop()})
    for value in values:
        q_object |= Q(**{field: value})
    return query_set.filter(q_object)


def boolean_filter(query_set, field, values):
    q_object = Q(**{field: values.pop()})
    for value in values:
        q_object |= Q(**{field: value})
    return query_set.filter(q_object)


def number_filter(query_set, field, values):
    q_object = filter_number(field, values.pop())
    for value in values:
        q_object |= filter_number(field, value)

    new_qset = query_set.filter(q_object)
    return new_qset


def date_filter(query_set, field, values):
    return query_set


FILTERS = {
        "text": text_filter,
        "choice": choice_filter,
        "boolean": boolean_filter,
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

    @property
    def model_class(self):
        return ContentType.objects\
                .get_for_id(self.kwargs['content_type_id'])\
                .model_class()

    def get_serializer_class(self):

        class GenericSerializer(serializers.ModelSerializer):
            class Meta:
                model = self.model_class
                fields = '__all__'
        return GenericSerializer

