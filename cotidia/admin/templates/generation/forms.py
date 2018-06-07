from django import forms

from betterforms.forms import BetterModelForm

from {{app_label}}.models import {{model_name}}


class {{model_name}}AddForm(BetterModelForm):

    class Meta:
        model = {{model_name}}
        fields = [
            {% for f in fields %}"{{f.1}}",{% if not forloop.last %}
            {% endif %}{% endfor %}
        ]
        fieldsets = (
            ('info', {
                'fields': (
                    {% for f in fields %}"{{f.1}}",{% if not forloop.last %}
                    {% endif %}{% endfor %}
                ),
                'legend': '{{model_verbose_name|title}} details'
            }),
        )


class {{model_name}}UpdateForm(BetterModelForm):

    class Meta:
        model = {{model_name}}
        fields = [
            {% for f in fields %}"{{f.1}}",{% if not forloop.last %}
            {% endif %}{% endfor %}
        ]
        fieldsets = (
            ('info', {
                'fields': (
                    {% for f in fields %}"{{f.1}}",{% if not forloop.last %}
                    {% endif %}{% endfor %}
                ),
                'legend': '{{model_verbose_name|title}} details'
            }),
        )
