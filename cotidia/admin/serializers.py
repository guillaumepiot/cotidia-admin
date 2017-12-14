from rest_framework import fields, serializers


class AdminModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        repr = super().to_representation(instance)
        # Must also check that the parent of the parent is not None as the top
        # serializer is always a list serializer
        if (
                serializers.ListSerializer in self.parent.__class__.mro()
                and self.parent.parent is not None
        ):
            return repr[self.SearchProvider.display_field]
        return repr
