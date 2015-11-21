# -*- coding: utf-8 -*-
"""Base Weather object"""

from __future__ import print_function
from functools import wraps


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


