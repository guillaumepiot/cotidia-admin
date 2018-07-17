from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, UpdateAPIView
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.pagination import LimitOffsetPagination

from django.contrib.contenttypes.models import ContentType
from django.core.exceptions import ValidationError
from django.http import Http404
from django.apps import apps

from cotidia.admin.utils import (
    search_objects,
    get_queryset,
    get_object_options
)
from cotidia.admin.serializers import (
    SortSerializer,
    AdminSearchLookupSerializer
)


PAGE_SIZE = 50


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


class AdminSearchDashboardUpdateView(UpdateAPIView):
    _serializer_class = None
    _model_class = None
    lookup_field = 'uuid'
    lookup_url_kwarg = 'uuid'

    def get_permissions(self):
        if self.kwargs.get("permissions_classes"):
            self.permission_classes = self.kwargs.get("permissions_classes")
        return super().get_permissions()

    def get_queryset(self):
        return self.get_model_class().objects.all()

    def get_model_class(self):
        if not self._model_class:
            self._model_class = ContentType.objects.get(
                app_label=self.kwargs['app_label'],
                model=self.kwargs['model']
            ).model_class()
        return self._model_class

    def get_serializer_class(self):
        if self.kwargs.get("serializer_class", False):
            return self.kwargs.get("serializer_class")
        if not self._serializer_class:
            model_class = self.get_model_class()
            self._serializer_class = model_class.SearchProvider.serializer()
        return self._serializer_class


class AdminSearchDashboardAPIView(ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = GenericAdminPaginationStyle
    _model_class = None
    _serializer_class = None

    def get_permissions(self):
        if self.kwargs.get("permissions_classes"):
            self.permission_classes = self.kwargs.get("permissions_classes")
        return super().get_permissions()

    def get_model_class(self):
        if not self._model_class:
            self._model_class = ContentType.objects.get(
                app_label=self.kwargs['app_label'],
                model=self.kwargs['model']
            ).model_class()
        return self._model_class

    def get_serializer_class(self):
        if self.kwargs.get("serializer_class", False):
            return self.kwargs.get("serializer_class")
        if not self._serializer_class:
            model_class = self.get_model_class()
            self._serializer_class = model_class.SearchProvider.serializer()
        return self._serializer_class

    def get_queryset(self):
        model_class = self.get_model_class()
        serializer_class = self.kwargs.get("serializer_class", None)

        if not serializer_class:
            serializer_class = model_class.SearchProvider.serializer()

        qs = get_queryset(
            model_class,
            serializer_class=serializer_class,
            filter_args=self.request.GET
        )

        return qs


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
                    raise Http404(
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


class AdminMultipleSelectAPIView(ListAPIView):
    permission_classes = (permissions.IsAdminUser,)
    serializer_class = AdminSearchLookupSerializer

    def get_queryset(self):
        query = self.request.GET.get("q")
        results = get_object_options(
            self.kwargs['app_label'],
            self.kwargs['model_name'],
            query
        )
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
