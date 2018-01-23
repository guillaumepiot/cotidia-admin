from django import forms

from betterforms.forms import BetterModelForm

from {{app_label}}.models import {{model_name}}


class {{model_name}}AddForm(BetterModelForm):

    class Meta:
        model = {{model_name}}
        fields = [
            {% for f in fields %}"{{f.1}}",
            {% endfor %}
        ]


class {{model_name}}UpdateForm(BetterModelForm):

    class Meta:
        model = {{model_name}}
        fields = [
            {% for f in fields %}"{{f.1}}",
            {% endfor %}
        ]
