from rest_framework import serializers
from cotidia.admin.search_dashboard_settings import (
    SUPPORTED_FIELDS_TYPES,
    FIELD_MAPPING
)

class AdminModelSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        repr = super().to_representation(instance)
        # Must also check that the parent of the parent is not None as the top
        # serializer is always a list serializer
        if (
            serializers.ListSerializer in self.parent.__class__.mro() and
            self.parent.parent is not None
        ):
            try:
                return repr[self.SearchProvider.display_field]
            except AttributeError:
                raise AttributeError(
                    "%s does not have the display_field defined in the SearchProvider sub class" % str(self.__class__.__name__)
                )
        return repr

    def get_choices(self):
        try:
            qs = self.get_choice_queryset()
            return [{"value": str(x.uuid), "label": getattr(x, self.SearchProvider.display_field)} for x in qs]
        except AttributeError as e:
            print(e)
            raise AttributeError(
                "%s does not have the display_field defined in the SearchProvider sub class" % str(self.__class__.__name__)
            )
    
    def get_choice_queryset(self):
        return self.Meta.model.objects.all()
        
    
    def get_field_representation(self):
        repr = {}
        for field_name, field in self.fields.items():

            if isinstance(field, AdminModelSerializer):
                nested_repr = field.get_field_representation()
                for key, value in nested_repr.items():
                    repr["{}__{}".format(field_name, key)] = value
            elif isinstance(field, serializers.ListSerializer):
                default_field_ref = FIELD_MAPPING[field.__class__.__name__]()
                default_field_ref["options"] = field.child.get_choices()
                repr[field_name] = default_field_ref 
            else:
                # Gets the most specific class of we support for the given field type if not it return None
                field_type = next(  
                    iter(
                        [t for t in SUPPORTED_FIELDS_TYPES if isinstance(field, t)]),
                        None
                    )
                if field_type is None:
                    print("Unsupported field {} of type {}".format(field_name,field))
                
                default_field_ref = FIELD_MAPPING[field_type.__name__]()
                if hasattr(field, "choices"):
                    choices = field.choices
                    default_field_ref["filter"] = 'choice'
                    default_field_ref["options"] = [
                        {"value": value, "label": label} for value, label in field.choices.items()
                    ]

                repr[field_name] = default_field_ref

        for key, default_field_repr in repr.items():
            try:
                overrides = self.SearchProvider.field_representation[key]
                default_field_repr.update(overrides)
            except (AttributeError, KeyError):
                pass
            repr[key] = default_field_repr
            
        return repr



class SortSerializer(serializers.Serializer):
    data = serializers.ListField(
        child=serializers.UUIDField()
    )


class AdminSearchLookupSerializer(serializers.Serializer):
    value = serializers.CharField()
    label = serializers.CharField()
