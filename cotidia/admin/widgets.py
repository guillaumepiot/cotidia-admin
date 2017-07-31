import re
import datetime

from django.utils.safestring import mark_safe
from django.utils.dates import MONTHS
from django.forms.widgets import Widget, Select

RE_DATE = re.compile(r'(\d{4})-(\d\d?)-(\d\d?)$')
RE_TIME = re.compile(r'(\d\d?)?:(\d\d?)?$')


class SelectDateWidget(Widget):
    """A Widget that splits date input into three <select> boxes.

    This also serves as an example of a Widget that has more than one HTML
    element and hence implements value_from_datadict.
    """

    none_value = (0, '---')
    month_field = '%s_month'
    day_field = '%s_day'
    year_field = '%s_year'

    def __init__(self, attrs=None, years=None, required=True):
        # years is an optional list/tuple of years to use in the "year"
        # select box.
        self.attrs = attrs or {}
        self.required = required
        if years:
            self.years = years
        else:
            this_year = datetime.date.today().year - 1
            self.years = range(this_year, this_year+10)

    def format_time_value(self, value):
        if value < 10:
            return '0%s' % value
        else:
            return '%s' % value

    def render(self, name, value, attrs=None):

        try:
            year_val, month_val, day_val = value.year, value.month, value.day
        except AttributeError:
            year_val = month_val = day_val = None
            if isinstance(value, str):
                match = RE_DATE.match(value)
                if match:
                    year_val, month_val, day_val = [
                        int(v) for v in match.groups()
                        ]

        if 'id' in self.attrs:
            id_ = self.attrs['id']
        else:
            id_ = 'id_%s' % name

        date_output = []

        #########
        # Day   #
        #########

        day_choices = [(i, i) for i in range(1, 32)]
        if not (self.required and value):
            day_choices.insert(0, (0, 'Day'))

        local_attrs = self.build_attrs(self.attrs)

        s = Select(choices=day_choices)
        select_html = s.render(self.day_field % name, day_val, local_attrs)
        date_output.append(select_html)

        #########
        # Month #
        #########

        month_choices = tuple(MONTHS.items())
        if not (self.required and value):
            month_choices = ((0, 'Month'),) + month_choices
        local_attrs['id'] = self.month_field % id_

        s = Select(choices=month_choices)
        select_html = s.render(self.month_field % name, month_val, local_attrs)
        date_output.append(select_html)

        #########
        # Year  #
        #########

        year_choices = [(i, i) for i in self.years]
        if not (self.required and value):
            year_choices.insert(0, (0, 'Year'))
        local_attrs['id'] = self.year_field % id_
        s = Select(choices=year_choices)
        select_html = s.render(self.year_field % name, year_val, local_attrs)
        date_output.append(select_html)

        return mark_safe(u"""<div class="date-select">
            <div class="form__control form__control--select">%s</div>
            <div class="form__control form__control--select">%s</div>
            <div class="form__control form__control--select">%s</div>
            </div>""" % (date_output[0], date_output[1], date_output[2]))

    def value_from_datadict(self, data, files, name):
        y = data.get(self.year_field % name)
        m = data.get(self.month_field % name)
        d = data.get(self.day_field % name)
        if y == m == d == "0":
            return None
        if y and m and d:
            return '%s-%s-%s' % (y, m, d)
        return data.get(name, None)


class SelectTimeWidget(Widget):
    """A Widget that splits date input into two <select> boxes."""

    none_value = (0, '---')
    hour_field = '%s_hour'
    minute_field = '%s_minute'

    def __init__(self, attrs=None, years=None, required=True):
        # years is an optional list/tuple of years to use in the "year"
        # select box.
        self.attrs = attrs or {}
        self.required = required

    def format_time_value(self, value):
        if int(value) < 10:
            return '0%s' % value
        else:
            return '%s' % value

    def render(self, name, value, attrs=None):

        try:
            hour_val, minute_val = value.hour, value.minute
        except AttributeError:
            hour_val = minute_val = None
            if isinstance(value, str):
                match = RE_TIME.match(value)
                if match:
                    hour_val, minute_val = [v for v in match.groups()]

        if 'id' in self.attrs:
            id_ = self.attrs['id']
        else:
            id_ = 'id_%s' % name

        time_output = []

        #########
        # Hour #
        #########

        hour_choices = [(i, self.format_time_value(i)) for i in range(0, 24)]
        if not (self.required and value):
            hour_choices.insert(0, ('', 'Hour'))
        local_attrs = self.build_attrs(self.attrs)

        s = Select(choices=hour_choices)
        select_html = s.render(
            self.hour_field % name, str(hour_val), local_attrs)
        time_output.append(select_html)

        ##########
        # Minute #
        ##########

        minute_choices = [(i, self.format_time_value(i)) for i in range(0, 60)]
        if not (self.required and value):
            minute_choices.insert(0, ('', 'Mins'))
        local_attrs = self.build_attrs(self.attrs)

        s = Select(choices=minute_choices)
        select_html = s.render(
            self.minute_field % name, str(minute_val), local_attrs)
        time_output.append(select_html)

        time_output = """<div class="time-select">
            <div class="form__control form__control--select">%s</div>
            <div class="form__control form__control--select">%s</div>
            </div>""" % (time_output[0], time_output[1])

        return mark_safe(u'%s' % (time_output))

    def value_from_datadict(self, data, files, name):
        h = data.get(self.hour_field % name)
        minute = data.get(self.minute_field % name)
        if not h and not minute:
            return None
        return '%s:%s' % (
            self.format_time_value(h),
            self.format_time_value(minute)
            )


class SelectDateTimeWidget(Widget):
    """A Widget that splits date input into three <select> boxes.

    This also serves as an example of a Widget that has more than one HTML
    element and hence implements value_from_datadict.
    """

    none_value = (0, '---')
    month_field = '%s_month'
    day_field = '%s_day'
    year_field = '%s_year'

    hour_field = '%s_hour'
    minute_field = '%s_minute'

    def __init__(self, attrs=None, years=None, required=True):
        # years is an optional list/tuple of years to use in the "year"
        # select box.
        self.attrs = attrs or {}
        self.required = required
        if years:
            self.years = years
        else:
            this_year = datetime.date.today().year - 1
            self.years = range(this_year, this_year+10)

    def format_time_value(self, value):
        if value < 10:
            return '0%s' % value
        else:
            return '%s' % value

    def render(self, name, value, attrs=None):

        try:
            year_val, month_val, day_val, hour_val, minute_val = value.year, value.month, value.day, value.hour, value.minute
        except AttributeError:
            year_val = month_val = day_val = hour_val = minute_val = None
            if isinstance(value, str):
                match = RE_DATE.match(value)
                if match:
                    year_val, month_val, day_val, hour_val, minute_val = [
                        int(v) for v in match.groups()
                        ]

        if 'id' in self.attrs:
            id_ = self.attrs['id']
        else:
            id_ = 'id_%s' % name

        date_output = []
        time_output = []

        #########
        # Day   #
        #########

        day_choices = [(i, i) for i in range(1, 32)]
        if not (self.required and value):
            day_choices.insert(0, (0, 'Day'))

        local_attrs = self.build_attrs(self.attrs)

        s = Select(choices=day_choices)
        select_html = s.render(self.day_field % name, day_val, local_attrs)
        date_output.append(select_html)

        #########
        # Month #
        #########

        month_choices = tuple(MONTHS.items())
        if not (self.required and value):
            month_choices = ((0, 'Month'),) + month_choices
        local_attrs['id'] = self.month_field % id_

        s = Select(choices=month_choices)
        select_html = s.render(self.month_field % name, month_val, local_attrs)
        date_output.append(select_html)

        #########
        # Year  #
        #########

        year_choices = [(i, i) for i in self.years]
        if not (self.required and value):
            year_choices.insert(0, (0, 'Year'))
        local_attrs['id'] = self.year_field % id_
        s = Select(choices=year_choices)
        select_html = s.render(self.year_field % name, year_val, local_attrs)
        date_output.append(select_html)

        #########
        # Hour #
        #########

        hour_choices = [(i, self.format_time_value(i)) for i in range(0, 23)]
        if not (self.required and value):
            hour_choices.insert(0, ('', 'Hour'))
        local_attrs = self.build_attrs(self.attrs)

        s = Select(choices=hour_choices)
        select_html = s.render(self.hour_field % name, hour_val, local_attrs)
        time_output.append(select_html)

        ##########
        # Minute #
        ##########

        minute_choices = [(i, self.format_time_value(i)) for i in range(0, 59)]
        if not (self.required and value):
            minute_choices.insert(0, ('', 'Minute'))
        local_attrs = self.build_attrs(self.attrs)

        s = Select(choices=minute_choices)
        select_html = s.render(
            self.minute_field % name, minute_val, local_attrs)
        time_output.append(select_html)

        date_output = """<div class="date-select">
            <div class="form__control form__control--select">%s</div>
            <div class="form__control form__control--select">%s</div>
            <div class="form__control form__control--select">%s</div>
            </div>""" % (date_output[0], date_output[1], date_output[2])

        time_output = """<div class="time-select">
            <div class="form__control form__control--select">%s</div>
            <div class="form__control form__control--select">%s</div>
            </div>""" % (time_output[0], time_output[1])

        return mark_safe(u'%s%s' % (date_output, time_output))

    def value_from_datadict(self, data, files, name):
        y = data.get(self.year_field % name)
        m = data.get(self.month_field % name)
        d = data.get(self.day_field % name)
        h = data.get(self.hour_field % name)
        minute = data.get(self.minute_field % name)
        if y == m == d == h == minute == "0":
            return None
        if y and m and d and h and minute:
            return '%s-%s-%s %s:%s' % (y, m, d, int(h), int(minute))
        return data.get(name, None)
