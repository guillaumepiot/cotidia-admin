from cotidia.account.conf import settings
from django.shortcuts import redirect
from django.core.exceptions import PermissionDenied
from django.db.models.fields import (
        UUIDField,
        DateTimeField,
        DateField,
        CharField,
        IntegerField,
        BooleanField,
        AutoField,
        TextField,
        )
from rest_framework import fields
from rest_framework import serializers

SUPPORTED_FIELD_TYPES_MODEL = [
        UUIDField,
        DateTimeField,
        DateField,
        CharField,
        IntegerField,
        BooleanField,
        AutoField,
        TextField,
        ]
SUPPORTED_FIELD_TYPES_SERIALIZER = [
        fields.UUIDField,
        fields.DateTimeField,
        fields.DateField,
        fields.CharField,
        fields.IntegerField,
        fields.BooleanField,
        fields.ChoiceField
        ]
FIELD_MAPPING = {
        "DateTimeField": (lambda: {
            "display": "datetime",
            "filter": "date"
            }),
        "UUIDField": (lambda: {
            "display": "verbatim",
            "filter": "text"
            }),
        "DateField": (lambda: {
            "display": "date",
            "filter": "date"
            }),
        "CharField": (lambda: {
            "display": "verbatim",
            "filter": "text"
            }),
        "ChoiceField": (lambda: {
            "display": "verbatim",
            "filter": "choice"
            }),
        "IntegerField": (lambda: {
            "display": "verbatim",
            "filter": "number"
            }),
        "BooleanField": (lambda: {
            "display": "boolean",
            "filter": "boolean"
            }),
        "TextField": (lambda: {
            "display": "verbatim",
            "filter": "text"
            }),
        "AutoField": (lambda: {
            "display": "verbatim",
            "filter": "number"
            }),
        }


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


def get_model_serializer_class(model_class):
    try:
        return model_class.__meta__.serializer
    except AttributeError:
        try:
            class GenericSerializer(serializers.ModelSerializer):
                field_representation = model_class.__meta__.field_representation
                class Meta:
                    model = model_class
                    fields = '__all__'
            return GenericSerializer

        except AttributeError:
            class GenericSerializer(serializers.ModelSerializer):
                class Meta:
                    model = model_class
                    fields = '__all__'
            return GenericSerializer


def get_field_representation(field_name, field, model):
    """ Creates a dict object for a given field using field mapping above
        Fields not in (or a subclass of) elements in the SUPPORTED_FIELD_TYPES
        list will return as "None"
    """
    # Gets the first element that the field is an instance of The list is
    # sorted so the most specific classes are checked first using mro()
    sorted_types = sorted(
            SUPPORTED_FIELD_TYPES_SERIALIZER,
            key=lambda x: len(x.mro())
            )

    type = next(
            iter([t for t in sorted_types if isinstance(field, t)]),
            None)

    if type is None:
        return None

    # Gets the base representation for the given field type
    field_representation = FIELD_MAPPING[type.__name__]()
    field_representation['label'] = field_name
    try:
        field_representation['options'] = tuple(field.choices.items())
    except AttributeError:
        pass

    # Checks if the developer has defined the field manually in the model
    try:
        print(dir(field_name.__class__))
        if field_name in model.field_representation:
            print("META FOUND")
            user_defined_representation = model.field_representation[field_name]
            for key in user_defined_representation:
                field_representation[key] = user_defined_representation[key]
    except (KeyError, AttributeError) as e:
        if field_name == "choice_field":
            print("Oh crap")
            print(e)
        pass

    print(field_representation)
    return field_representation


def get_fields_from_model(model):
    try:
        serializer = model.__meta__.serializer()
    except AttributeError:
        serializer = get_model_serializer_class(model)()
    return get_fields_from_serializer(serializer)


def get_fields_from_serializer(serializer):
    fields_representation = {}
    fields = serializer.fields
    for f in fields:
        field_representation = get_field_representation(
                f,
                fields[f],
                serializer
                )
        if field_representation is not None:
            fields_representation[f] = field_representation
        else:
            print("Field not supported: %s" % f)

    return fields_representation


def get_serializer_default_columns(serializer):
    fields = []
    try:
        fields = serializer.__meta__.default_fields
    except (AttributeError):
        fields = [f for f in get_fields_from_serializer(serializer).keys()]
    return fields


def get_model_structure(
        model,
        endpoint=None,
        detail_endpoint=None,
        token=None
        ):
    serializer = get_model_serializer_class(model)()
    structure = {
            "columns": get_fields_from_serializer(serializer),
            "defaultColumns": get_serializer_default_columns(serializer)

            }
    print("structure")
    print(structure)
    if endpoint is not None:
        structure['endpoint'] = endpoint
    if detail_endpoint is not None:
        structure['detailURL'] = detail_endpoint
    if token is not None:
        structure['authToken'] = token

    return structure
