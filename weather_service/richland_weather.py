# -*- coding: utf-8 -*-
"""Gathers and caches weather data."""

from __future__ import print_function
from functools import wraps
import requests
import datetime
import pytz
import re

def datetime_to_epoch(indate):
    """Converts a datetime object to an epoch timestamp."""
    origin = datetime.datetime(1970, 1, 1)
    if indate.tzinfo:
        origin = pytz.timezone('UTC').localize(origin)
    return (indate - origin).total_seconds()


class Weather(object):
    """Interface for class which gathers weather data."""
    def get_weather(self, time=None, location=None):
        """Return the weather information for a given time and location."""
        raise NotImplementedError("Cannot call method on absract"+\
                                  " base class 'Weather'")
    def __call__(self):
        """Passthrough to the "get_weather" method. Done to allow uniform
        access in by service_main.py to each service."""
        return self.get_weather()

def ensure_default_weather(func):
    """Decorator to add default values for missing dictionary entries to a dict
    of weather results. Allows the decorated callable to return a dict with
    only the values it has data for."""

    @wraps(func)
    def expand(*args, **kwargs):
        """Does the actual expansion of the returned data."""
        label, ret = func(*args, **kwargs)
        required_keys = ['text', 'temperature', 'wind_speed', 'wind_direction',
                         'relative_humidity']

        # Add default value of `None` for any missing keys in the returned
        # dictionary
        for rk in required_keys:
            if not rk in ret:
                ret[rk] = None
        return label, ret
    return expand




class RichlandWeather(Weather):
    """Returns weather data for Richland, Washington, by scraping the Hanford
    Meteorological Survey data."""
    def __init__(self):
        """Initialize self."""
        source_url = "http://www.hanford.gov/c.cfm/hms/realTime.cfm/stat11"
        self.source_url = source_url
        self.source_label = "richland"

    @ensure_default_weather
    def get_weather(self, time=None, location=None):
        """Retrieve and parse weather data, returns label for this service and
        weather data as dict."""
        req = requests.get(self.source_url)
        text = req.text
        moment = self.extract_datetime(text)
        met_data = self.parse_hms_data(text)
        met_data['time'] = moment
        met_data['text'] = text
        return self.source_label, met_data

    def _sanitize_date(self, datestr):
        """Ensure date string has zero-padded numbers. Done because `strptime`
        requires zero-padded numbers for month of year and day of month."""
        nums = [int(x) for x in datestr.split('/')]
        padded = ["{:0>2}".format(x) for x in nums]
        return "/".join(padded)

    def extract_datetime(self, text):
        """Retrieves the date and time from weather data, returns datetime."""
        time = text.split('Time:')[1].split('  ')[0].strip()
        date = text.split('Date:')[1].split('\n')[0].strip()
        date = self._sanitize_date(date)

        dst = False
        if "PDT" in time:
            dst = True

        momentstr = " ".join([date, time.split(' ')[0]])
        fmt = "%m/%d/%Y %H:%M:%S"
        naive_moment = datetime.datetime.strptime(momentstr, fmt)

        zone = pytz.timezone('US/Pacific')
        moment = zone.localize(naive_moment, is_dst=dst)

        return datetime_to_epoch(moment)

    def extract_readings(self, text):
        # Making this docstring a raw string because it contains backslash
        # characters from a regex
        r"""Extract only the measurement readings from the HMS data.

        In general, the HMS data is in the form 'key = value'. However, there
        are some odd edge cases, so I use a regular expression to extract the
        data. The following is an annotated copy of the regular expression with
        an example:

            \s\s(\w|\s|-)*\s*=\s*([-+]?\d*\.\d+|\d+)
            └──┘└───────┘└──────┘└─────────────────┘
             0      1        2            3

              blah 12num foo-bar baz = -12345.0
            └┘└────────────────────┘└─┘└──────┘
            0           1            2    3

        0: Two blank whitespace characters. Since every line in the hms data
        begins with a space, this matches to a newline followed by a space, or
        two literal spaces. Done becasue some lines have two data readings,
        with the only delimiter being multiple spaces between them.
        1: Some combination of words, whitespace, and hyphens. Have to handle
        hyphens because some keys have names like 'Dew-point'.
        2: An equals symbol optionally surrounded by whitespace
        3: A decimal number of some kind

        Fields 1 and 3 become the 'key' and 'value', respectively, in the
        returned dictionary. Numbers/digits are not cast to float, and are left
        as strings.

        """
        float_expr = r"([-+]?\d*\.\d+|\d+)"
        result_expr = r"\s\s(\w|\s|-)*\s*=\s*"+float_expr

        results = []
        for match in re.finditer(result_expr, text):
            results.append(match.group(0).strip())

        allstrip = lambda x: [q.strip() for q in x]
        results = [allstrip(match.split('=')) for match in results]
        results = {x[0]:x[1] for x in results}

        return results

    def parse_hms_data(self, text):
        """Returns a dict containing a subset of the data read from the Hanford
        meteorological survey site."""
        readings = self.extract_readings(text)
        keymap = {"temperature":"Ave Temp 10m",
                  "wind_speed":"Ave Wind Speed 10m",
                  "wind_direction":"Ave Wind Direction 10m",
                  "temp_delta_hour":"Delta Temp 60m-10m",
                  "relative_humidity":"Rel-Humidity"
                 }
        data = {}
        for key in keymap:
            data[key] = float(readings[keymap[key]])
        data['readings'] = readings
        return data




if __name__ == '__main__':
    from pprint import pprint
    pprint(RichlandWeather().get_weather())

