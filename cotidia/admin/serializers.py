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
            try:
                return repr[self.SearchProvider.display_field]
            except AttributeError:
                raise AttributeError("%s does not have the display_field defined in the SearchProvider sub class" % str(self.__class__.__name__))
        return repr
