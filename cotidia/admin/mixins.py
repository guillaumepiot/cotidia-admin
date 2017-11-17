from django.db import transaction

from cotidia.admin.signals import ordering_complete
from warnings import warn


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
