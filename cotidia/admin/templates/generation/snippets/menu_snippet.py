{
    "text": "{{model_verbose_name}}",
    "icon": "warning",
    "url": reverse("{{app_label}}-admin:{{model_name|lower}}-list"),
    "permissions": ["{{app_label}}.add_{{model_name|lower}}",
                    "{{app_label}}.change_{{model_name|lower}}"],
},
