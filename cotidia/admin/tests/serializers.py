from cotidia.admin.serializers import AdminModelSerializer
from cotidia.admin.tests.models import GenericRecord, GenericRecordNoMeta,GenericRecordTwo


class GenericRecordSerializerNoMeta(AdminModelSerializer):
    class Meta:
        display_field = "char_field"
        model = GenericRecordNoMeta
        fields = '__all__'


class GenericRecordSerializerTwo(AdminModelSerializer):
    class SearchProvider:
        display_field = "char_field"
        pass
    class Meta:
        display_field = "char_field"
        model = GenericRecordTwo
        fields = '__all__'


class GenericRecordSerializer(AdminModelSerializer):
    foreign_key_field = GenericRecordSerializerNoMeta()
    many_to_many_field = GenericRecordSerializerTwo(many=True)

    class SearchProvider:
        display_field = "char_field"
        field_representation = {
                "choice_field": {"label": "TEST_LABEL"},
                "date_field": {"label": "TEST_LABEL2"},
                "foreign_key_field__choice_field": {
                    "label": "replacement_label"
                    }
        }
        default_fields = ["id", "char_field"]

    class Meta:
        model = GenericRecord
        fields = '__all__'
