from django.db import models, transaction
from django.contrib.contenttypes.models import ContentType
from django.db.models import Max

from cotidia.admin.signals import ordering_complete


class AbstractOrderable(models.Model):
    """Class for creating ordered objects."""

    order_id = models.PositiveIntegerField(default=0)

    def orderable_queryset(self):
        return self.__class__.objects.filter()

    @property
    def content_type(self):
        content_type = ContentType.objects.get_for_model(self)
        return content_type

    def save(self, *args, **kwargs):
        if not self.order_id:
            max_order_id = self.orderable_queryset().aggregate(
                Max('order_id')
            )['order_id__max']
            if max_order_id:
                self.order_id = max_order_id + 1
            else:
                self.order_id = 1
        return super().save(*args, **kwargs)

    def move_up(self):
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
        item_order_id = item.order_id
        item.order_id = self.order_id
        self.order_id = item_order_id
        item.save()
        self.save()

        # Send signal
        ordering_complete.send(sender=self.__class__)

    class Meta:
        abstract = True
