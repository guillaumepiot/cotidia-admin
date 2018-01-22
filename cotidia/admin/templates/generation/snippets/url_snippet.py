url( r'^{{model_name|lower}}/',
    include('{{app_label}}.urls.admin.{{model_name|lower}}'),
),
