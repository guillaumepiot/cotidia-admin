import django_filters

from cotidia.admin.views import (
    AdminListView,
    AdminDetailView,
    AdminDeleteView,
    AdminCreateView,
    AdminUpdateView
)

from {{app_label}}.models import {{model_name}}
from {{app_label}}.forms.admin.{{model_name|lower}} import (
    {{model_name}}AddForm,
    {{model_name}}UpdateForm)


class {{model_name}}Filter(django_filters.FilterSet):
    # name = django_filters.CharFilter(
    #     lookup_expr="icontains",
    #     label="Name"
    # )
    class Meta:
        model = {{model_name}}
        fields = [
            {% for f in fields %}{% if f.1 != "id" %}"{{f.1}}",{% endif %}{% if not forloop.last %}
            {% endif %}{% endfor %}
        ]


class {{model_name}}List(AdminListView):
    columns = (
        {% for f in fields %}{% if f.1 != "id" %}("{{f.0|title}}", "{{f.1}}"),{% endif %}{% if not forloop.last %}
        {% endif %}{% endfor %}
    )
    model = {{model_name}}
    filterset = {{model_name}}Filter
    row_actions = ["create", "update", "view", "delete"]


class {{model_name}}Detail(AdminDetailView):
    model = {{model_name}}
    permission_required = '{{app_label}}.change_{{model_name|lower}}'
    fieldsets = [
        {
            "legend": '{{model_verbose_name|title}} Details',
            "fields": [
                [
                    {% for f in fields %}{% if f.1 != "id" %}{
                        "label": "{{f.0|title}}",
                        "field": "{{f.1}}"
                    },{% endif %}{% if not forloop.last %}
                ], [{% endif %}
                {% endfor %}]
            ]
        }
    ]


class {{model_name}}Create(AdminCreateView):
    model = {{model_name}}
    form_class = {{model_name}}AddForm
    permission_required = '{{app_label}}.add_{{model_name|lower}}'


class {{model_name}}Update(AdminUpdateView):
    model = {{model_name}}
    form_class = {{model_name}}UpdateForm
    permission_required = '{{app_label}}.change_{{model_name|lower}}'


class {{model_name}}Delete(AdminDeleteView):
    model = {{model_name}}
    permission_required = 'app.delete_{{model_name|lower}}'

