import re
from decimal import Decimal
import datetime

from functools import reduce

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.pagination import LimitOffsetPagination

from django.db.models import Q, F, Count, Case, When, CharField
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.apps import apps

from cotidia.admin.utils import (
    get_fields_from_model,
    get_model_serializer_class,
    search_objects,
    get_field_representation
)
from cotidia.admin.serializers import (
    SortSerializer,
    AdminSearchLookupSerializer
)


PAGE_SIZE = 50
number_pattern = r"(\-?[0-9]+(?:\.[0-9]+)?)"
date_pattern = r"([0-9]{4}-[0-9]{2}-[0-9]{2})"
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
    """Create a function that filters a value that matches the parameter regex."""
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
    lambda x: datetime.datetime.strptime(x, "%Y-%m-%d").date()
)


def contains_filter(query_set, field, values):
    """Check if a field contains a value."""
    return field_filter(
        lambda x, y: Q(**{x + "__icontains": y}), query_set, field, values)


def exact_match_filter(query_set, field, values):
    """Check if a field exactly matches a value."""
    return field_filter(lambda x, y: Q(**{x: y}), query_set, field, values)


def boolean_filter(queryset, field, values):
    return field_filter(
        lambda x, y: Q(**{x: y == "true"}),
        queryset,
        field,
        values
    )


def number_filter(query_set, field, values):
    """Check if a number fits a constraints."""
    return field_filter(filter_number, query_set, field, values)


def field_filter(filter_fn, query_set, field, values):
    """Filter the fields with a given function
        The function must return a Q-object
        Each value is "OR"ed against eachother."""
    q_object = filter_fn(field, values.pop())
    for value in values:
        q_object |= filter_fn(field, value)
    return query_set.filter(q_object)


def date_filter(query_set, field, values):
    return field_filter(filter_date, query_set, field, values)


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
    "boolean": boolean_filter,
    "number": number_filter,
    "date": date_filter
}


def get_sub_serializer(serializer, field):
    fields = field.split("__")
    sub_serializer = serializer()
    for f in fields:
        sub_serializer = sub_serializer.fields[f].child

    return sub_serializer


class AdminOrderableAPIView(APIView):
    permission_classes = (permissions.IsAdminUser,)

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

class AdminSearchDashboardAPIView2(ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = GenericAdminPaginationStyle
    _model_class=None
    _serializer_class=None

    def get_model_class(self):
        if not self._model_class:
            self._model_class = ContentType.objects.get(
                app_label=self.kwargs['app_label'],
                model=self.kwargs['model']
            ).model_class()
        return self._model_class
    
    def get_serializer_class(self):
        if not self._serializer_class:
            model_class = self.get_model_class()
            self._serializer_class = model_class.SearchProvider.serializer()
        return self._serializer_class


    def get_queryset(self):
        model_class = self.get_model_class()
        serializer = model_class.SearchProvider.serializer()()
        field_repr = serializer.get_field_representation()
        related_fields = serializer.get_related_fields()

        # pre-fetch related fields
        qs = model_class.objects.all().select_related(*related_fields)

        # filters the general_search
        q_object = Q()
        q_list = self.request.GET.getlist('_q')
        for val in q_list:
            q_object = reduce(
                lambda x, y: x | y,
                [
                    Q(**{x + '__icontains': val})
                    for x in serializer.get_general_query_fields()
                ],
            )
        
        qs.filter(q_object)

        for field in field_repr.keys():
            filter_params = self.request.GET.getlist(field)
            if filter_params:
                if field_repr[field].get('many_to_many_field', False):
                    field += "__uuid"
                else:
                    filter_type = field_repr[field]['filter']
                    qs = FILTERS[filter_type](
                        qs,
                        field,
                        filter_params
                    )
        
        ordering_params = self.request.GET.getlist('_order')
        if ordering_params:
            # Here we add an annotation to make sure when we order, the value is
            # empty
            first_field = ordering_params[0]
            clean_field_name = first_field[
                1:] if first_field[0] == '-' else first_field
            try:
                condition_blank = Q(**{clean_field_name + "__exact": ""})
                annotation = {"val_is_empty": Count(Case(
                    When(condition_blank, then=1), output_field=CharField(),
                ))}
                qs = qs.annotate(**annotation)
                ordering_params = ["val_is_empty"] + ordering_params
            except (ValidationError, ValueError):
                # This is added as number an dates all have sensible defaults
                pass
            parsed_ordering_params = [
                parse_ordering(x) for x in ordering_params
            ]
            qs.order_by[parsed_ordering_params]

        return qs
            


class AdminSearchDashboardAPIView(ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
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
                suffix = ""
                try:
                    if field_data[field]['many']:
                        if field_data[field]['filter'] == 'choice':
                            suffix = "__uuid"
                        else:
                            sub_serializer = get_sub_serializer(serializer, field)
                            suffix = "__" + sub_serializer.SearchProvider.display_field
                except KeyError:
                    pass
                filter_type = field_data[field]['filter']
                query_set = FILTERS[filter_type](
                    query_set,
                    field + suffix,
                    filter_params
                )

        ordering_params = self.request.GET.getlist("_order")
        # Checks the first ordering param exists
        annotation = None
        if(ordering_params):
            # Cleans the "-" to just have the field name
            clean_field_name = ordering_params[0].replace("-", "")
            condition_blank = Q(**{clean_field_name + "__exact": ""})
            # If the the field is blank, then the val_is_empty will be true
            annotation = {"val_is_empty": Count(Case(
                When(condition_blank, then=1), output_field=CharField(),
            ))}
        ordering_params = list(map(parse_ordering, ordering_params))
        try:
            if annotation is not None:
                query_set = query_set.annotate(**annotation)
                ordering_params = ["val_is_empty"] + ordering_params
        except (ValueError, ValidationError) as e:
            # Neccessary for non string fields, nothing more needs to happen as they have sensible defaults
            pass
        return query_set.order_by(*list(ordering_params))

    def get_serializer_class(self):
        return get_model_serializer_class(self.model_class)

    @property
    def model_class(self):
        return ContentType.objects\
            .get(
                app_label=self.kwargs['app_label'],
                model=self.kwargs['model']
            ).model_class()


class SortAPIView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):
        serializer = SortSerializer(data=request.data)
        content_type = ContentType.objects.get(id=kwargs['content_type_id'])
        model_class = content_type.model_class()

        if serializer.is_valid():

            uuids = serializer.data["data"]

            # 1 required as order_ids must be > 0
            for i, uuid in enumerate(uuids, 1):
                try:
                    obj = model_class.objects.get(uuid=uuid)
                except model_class.DoesNotExist:
                    raise NotFound(
                        detail="Could not find a file matching the following uuid %s" % uuid
                    )
                except ValidationError:
                    raise ParseError(detail="Invalid UUID", code=400)
                obj.order_id = i
                obj.save()

            return Response(status=200)

        return Response(status=400, data=serializer.errors)


class AdminSearchLookupAPIView(ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = AdminSearchLookupSerializer

    def get_queryset(self):
        query = self.request.GET.get("q")
        results = search_objects(query)
        return results


class AdminBatchActionAPIView(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):

        app_label = kwargs['app_label']
        model_name = kwargs['model_name']
        action = kwargs['action']

        model_class = apps.get_model(app_label, model_name)

        if not request.POST.get('uuids'):
            return Response(status=400, data={'message': "please supply a list of uuids"})

        else:
            uuids = request.POST.getlist('uuids')
            objects = model_class.objects.filter(uuid__in=uuids)
            for obj in objects:
                func = getattr(obj, action)
                func()
                obj.refresh_from_db()

        return Response(status=204)
