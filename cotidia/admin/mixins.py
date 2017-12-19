from warnings import warn

from django.db import transaction
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.conf import settings

from cotidia.admin.signals import ordering_complete


class UserCheckMixin(object):

    def check_user(self, user):
        return True

    def dispatch(self, request, *args, **kwargs):
        if not self.check_user(request.user):
            if request.user.is_authenticated():
                raise PermissionDenied
            else:
                return redirect(settings.ACCOUNT_ADMIN_LOGIN_URL)
        return super().dispatch(request, *args, **kwargs)


class StaffPermissionRequiredMixin(UserCheckMixin):

    def get_permission_required(self):
        if hasattr(self, "permission_required"):
            return self.permission_required
        return None

    def check_user(self, user):
        """Check if the user has the relevant permissions."""
        if user.is_superuser:
            return True
        return user.is_staff and user.has_perm(self.get_permission_required())


class OrderableMixin:
    def _warn(self):
        warn("OrderableMixin is deprecated please move to using AbstractOrderable", DeprecationWarning)

    def orderable_queryset(self):
        self._warn()
        return self.__class__.objects.filter()

    def move_up(self):
        self._warn()
        # Find previous sibling
        queryset = self.orderable_queryset()

        if self.order_id is not None:
            queryset = queryset.filter(order_id__lt=self.order_id)
        else:
            raise Exception("Item must have an order_id to be re-ordered")

        item = queryset.order_by("-order_id").first()

        if item:
            self.swap(item)

    def move_down(self):
        self._warn()
        # Find next sibling
        queryset = self.orderable_queryset()

        if self.order_id is not None:
            queryset = queryset.filter(order_id__gt=self.order_id)
        else:
            raise Exception("Item must have an order_id to be re-ordered")

        item = queryset.order_by("order_id").first()
        if item:
            self.swap(item)

    @transaction.atomic
    def swap(self, item):
        self._warn()
        item_order_id = item.order_id
        item.order_id = self.order_id
        self.order_id = item_order_id
        item.save()
        self.save()

        # Send signal
        ordering_complete.send(sender=self.__class__)
