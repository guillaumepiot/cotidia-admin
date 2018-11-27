import csv
import json
import logging

from django.http import HttpResponse
from django.template.loader import render_to_string

from rest_framework.renderers import JSONRenderer

logger = logging.getLogger(__name__)

try:
    from weasyprint import HTML
except ModuleNotFoundError:
    HTML = None


def flatten_item(item):
    if item is None:
        return ""
    elif isinstance(item, list):
        return ", ".join([flatten_item(i) for i in item])

    return item


def render_to_csv(data, filename="export"):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="{}.csv"'.format(filename)

    writer = csv.writer(response)

    if data:
        json_data = JSONRenderer().render(data)

        data = json.loads(json_data)

        headers = [k for k in data[0].keys()]

        writer.writerow(headers)

        for row in data:
            columns = [flatten_item(v) for v in data[0].values()]

            writer.writerow(columns)

    return response


def render_to_pdf(data, template="admin/export/pdf.html", filename="export"):

    if HTML is None:
        raise Exception("Weasyprint module not installed!")

    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="{}.pdf"'.format(filename)

    if data:
        json_data = JSONRenderer().render(data)

        data = json.loads(json_data)

        context = {"keys": [k for k in data[0].keys()], "data": data}

        html = render_to_string(template, context)

        HTML(string=html).write_pdf(response)
    else:
        HTML(string="No data.").write_pdf(response)

    return response
