from rest_framework import serializers
from cotidia.admin.tests.models import GenericRecord, GenericRecordNoMeta


class GenericRecordSerializerNoMeta(serializers.ModelSerializer):
    class Meta:
        model = GenericRecordNoMeta
        fields = '__all__'


class GenericRecordSerializer(serializers.ModelSerializer):
    foreign_key_field = GenericRecordSerializerNoMeta()

    class __meta__:
        field_representation = {
                "choice_field": {"label": "TEST_LABEL"},
                "date_field": {"label": "TEST_LABEL2"}
                }
        default_fields = ["id", "char_field"]

    class Meta:
        model = GenericRecord
        fields = '__all__'
