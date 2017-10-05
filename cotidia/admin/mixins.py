from django.db import transaction

from cotidia.admin.signals import ordering_complete


class OrderableMixin:

    def orderable_queryset(self):
        return self.__class__.objects.filter()

    def move_up(self):
        # Find previous sibling
        item = self.orderable_queryset().filter(
            order_id__lt=self.order_id
        ).order_by("-order_id").first()
        if item:
            self.swap(item)

    def move_down(self):
        # Find next sibling
        item = self.orderable_queryset().filter(
            order_id__gt=self.order_id
        ).order_by("order_id").first()
        if item:
            self.swap(item)

    @transaction.atomic
    def swap(self, item):
        item_order_id = item.order_id
        item.order_id = self.order_id
        self.order_id = item_order_id
        item.save()
        self.save()

        # Send signal
        ordering_complete.send(sender=self.__class__)
