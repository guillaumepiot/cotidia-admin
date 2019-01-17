from collections import OrderedDict

from django.utils.module_loading import import_string
from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.http import Http404
from django.apps import apps
from django.db.models import Q, Count, Case, When, CharField

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.pagination import PageNumberPagination


from cotidia.admin.utils import (
    search_objects,
    get_queryset,
    get_object_options,
    parse_ordering,
)
from cotidia.admin.mixins import StaffPermissionRequiredMixin
from cotidia.admin.serializers import SortSerializer, AdminSearchLookupSerializer

PAGE_SIZE = 50


class AdminOrderableAPIView(APIView):
    permission_classes = (StaffPermissionRequiredMixin,)

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


class GenericAdminPaginationStyle(PageNumberPagination):
    page_size = PAGE_SIZE
    page_size_query_param = "_per_page"
    page_query_param = "_page"

    def get_paginated_response(self, data):
        return Response(
            OrderedDict(
                [
                    ("total_result_count", self.page.paginator.count),
                    ("current_page", self.page.number),
                    ("page_result_count", len(data)),
                    ("page_count", self.page.paginator.num_pages),
                    ("next", self.get_next_link()),
                    ("meta", self.get_meta_data()),
                    ("previous", self.get_previous_link()),
                    ("results", data),
                    ("first_result_index", self.page.start_index()),
                    ("last_result_index", self.page.end_index()),
                ]
            )
        )

    def get_meta_data(self):
        if hasattr(self, "queryset") and hasattr(self, "serializer"):
            return self.serializer.get_meta_data(self.page, self.queryset)
        else:
            return {}


class AdminSearchDashboardUpdateView(UpdateAPIView):
    _serializer_class = None
    _model_class = None

    lookup_field = "uuid"
    lookup_url_kwarg = "uuid"

    def get_permissions(self):
        if self.kwargs.get("permissions_classes"):
            self.permission_classes = self.kwargs.get("permissions_classes")

        return super().get_permissions()

    def get_queryset(self):
        return self.get_model_class().objects.all()

    def get_model_class(self):
        if not self._model_class:
            self._model_class = ContentType.objects.get(
                app_label=self.kwargs["app_label"], model=self.kwargs["model"]
            ).model_class()

        return self._model_class

    def get_serializer_class(self):
        if self.kwargs.get("serializer_class", False):
            return self.kwargs.get("serializer_class")

        if not self._serializer_class:
            model_class = self.get_model_class()

            self._serializer_class = model_class.SearchProvider.serializer()

        return self._serializer_class


class DynamicListAPIView(ListAPIView):
    permission_classes = (StaffPermissionRequiredMixin,)
    pagination_class = GenericAdminPaginationStyle
    permission_required = []
    _model_class = None
    _serializer_class = None

    def get_permissions(self):
        if self.kwargs.get("permissions_classes"):
            self.permission_classes = self.kwargs.get("permissions_classes")

        return super().get_permissions()

    @property
    def paginator(self):
        """
        The paginator instance associated with the view, or `None`.
        """
        if not hasattr(self, "_paginator"):
            if self.pagination_class is None:
                self._paginator = None
            else:
                self._paginator = self.pagination_class()
                self._paginator.queryset = self.get_queryset()
                self._paginator.serializer = self.get_serializer()
        return self._paginator

    def get_model_class(self):
        if not self._model_class:
            self._model_class = ContentType.objects.get(
                app_label=self.kwargs["app_label"], model=self.kwargs["model"]
            ).model_class()

        return self._model_class

    def get_queryset(self):
        if not hasattr(self, "_queryset"):
            model_class = self.get_model_class()
            serializer_class = self.get_serializer_class()
            serializer = serializer_class()

            filters = serializer.get_filters()
            filter_args = self.request.GET
            field_repr = serializer.get_field_representation()
            general_filter = serializer.get_general_query_filter()

            if serializer.get_option("get_queryset"):
                qs = serializer.get_option("get_queryset")()
            else:
                qs = model_class.objects.all()

            q_obj = Q()
            for name, filter in filters.items():
                qs = filter.annotate(qs)
                filter_params = filter_args.getlist(filter.get_query_param())
                q_obj &= filter.get_q_object(filter_params)

            if general_filter:
                general_query_params = filter_args.getlist("_q")
                qs = general_filter.annotate(qs)
                q_obj &= general_filter.get_q_object(general_query_params)

            qs = qs.filter(q_obj)

            for name, filter in filters.items():
                qs = filter.filter(qs, filter_args)

            if general_filter:
                qs = general_filter.filter(qs, filter_args)

            raw_ordering_params = filter_args.getlist("_order")
            ordering_params = []
            for param in raw_ordering_params:
                if param:
                    desc = False
                    key = param
                    if param[0] == "-":
                        desc = True
                        key = param[1:]

                    # Append custom ordering
                    if field_repr.get(key):
                        ordering_params += [
                            ("-" + x) if desc else x
                            for x in field_repr[key].get("ordering_fields", [key])
                        ]

            if ordering_params:
                # Here we add an annotation to make sure when we order, the value is
                # empty
                first_field = ordering_params[0]
                clean_field_name = (
                    first_field[1:] if first_field[0] == "-" else first_field
                )
                try:
                    condition_blank = Q(**{clean_field_name + "__exact": ""})
                    annotation = {
                        "val_is_empty": Count(
                            Case(
                                When(condition_blank, then=1), output_field=CharField()
                            )
                        )
                    }
                    qs = qs.annotate(**annotation)
                    ordering_params = ["val_is_empty"] + ordering_params
                except (ValidationError, ValueError):
                    # This is added as number an dates all have sensible defaults
                    pass
                parsed_ordering_params = [parse_ordering(x) for x in ordering_params]
                qs = qs.order_by(*parsed_ordering_params)
            else:
                default_order_by = serializer.get_option("default_order_by")
                if default_order_by:
                    qs = qs.order_by(default_order_by)

            self._queryset = qs
        return self._queryset

    def get_serializer_class(self):
        if self.kwargs.get("serializer_class", False):
            return self.kwargs.get("serializer_class")

        if not self._serializer_class:
            model_class = self.get_model_class()

            try:
                self._serializer_class = import_string(
                    model_class.SearchProvider.dynamic_list_serializer
                )
            except AttributeError:
                raise Exception(
                    "Model {} has no SearchProvider setup.".format(model_class.__name__)
                )

        return self._serializer_class


# class AdminSearchDashboardAPIView(ListAPIView):
#     permission_classes = (StaffPermissionRequiredMixin,)

#     pagination_class = GenericAdminPaginationStyle

#     _model_class = None

#     _serializer_class = None

#     def get_permissions(self):
#         if self.kwargs.get("permissions_classes"):
#             self.permission_classes = self.kwargs.get("permissions_classes")

#         return super().get_permissions()

#     def get_model_class(self):
#         if not self._model_class:
#             self._model_class = ContentType.objects.get(
#                 app_label=self.kwargs["app_label"], model=self.kwargs["model"]
#             ).model_class()

#         return self._model_class

#     def get_serializer_class(self):
#         if self.kwargs.get("serializer_class", False):
#             return self.kwargs.get("serializer_class")

#         if not self._serializer_class:
#             model_class = self.get_model_class()

#             self._serializer_class = model_class.SearchProvider.serializer()

#         return self._serializer_class

#     def get_queryset(self):
#         model_class = self.get_model_class()

#         serializer_class = self.get_serializer_class()

#         qs = get_queryset(
#             model_class, serializer_class=serializer_class, filter_args=self.request.GET
#         )

#         return qs


class SortAPIView(APIView):
    permission_classes = (StaffPermissionRequiredMixin,)

    def post(self, request, *args, **kwargs):
        serializer = SortSerializer(data=request.data)

        content_type = ContentType.objects.get(id=kwargs["content_type_id"])

        model_class = content_type.model_class()

        if serializer.is_valid():
            uuids = serializer.data["data"]

            # 1 required as order_ids must be > 0
            for i, uuid in enumerate(uuids, 1):
                try:
                    obj = model_class.objects.get(uuid=uuid)
                except model_class.DoesNotExist:
                    raise Http404(
                        detail="Could not find a file matching the following uuid %s"
                        % uuid
                    )
                except ValidationError:
                    raise ParseError(detail="Invalid UUID", code=400)

                obj.order_id = i
                obj.save()

            return Response(status=200)

        return Response(status=400, data=serializer.errors)


class AdminSearchLookupAPIView(ListAPIView):
    permission_classes = (StaffPermissionRequiredMixin,)

    serializer_class = AdminSearchLookupSerializer

    def get_queryset(self):
        query = self.request.GET.get("q")

        results = search_objects(query)

        return results


class AdminMultipleSelectAPIView(ListAPIView):
    permission_classes = (StaffPermissionRequiredMixin,)

    serializer_class = AdminSearchLookupSerializer

    def get_queryset(self):
        query = self.request.GET.get("q")

        results = get_object_options(
            self.kwargs["app_label"], self.kwargs["model_name"], query
        )

        return results


class AdminBatchActionAPIView(APIView):
    permission_classes = (StaffPermissionRequiredMixin,)

    def post(self, request, *args, **kwargs):
        app_label = kwargs["app_label"]

        model_name = kwargs["model_name"]

        action = kwargs["action"]

        model_class = apps.get_model(app_label, model_name)

        if not request.POST.get("uuids"):
            return Response(
                status=400, data={"message": "Please supply a list of uuids"}
            )
        else:
            uuids = request.POST.getlist("uuids")
            objects = model_class.objects.filter(uuid__in=uuids)

            for obj in objects:
                func = getattr(obj, action)

                func()

                obj.refresh_from_db()

        return Response(status=204)
