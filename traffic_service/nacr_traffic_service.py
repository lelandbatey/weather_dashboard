# -*- coding: utf-8 -*-
"""Gather traffic data for nacr.us"""

from __future__ import print_function
from functools import wraps
from .traffic import TrafficService
import requests
import datetime
import pytz
import re

from pprint import pprint

def datetime_to_epoch(indate):
    """Converts a datetime object to an epoch timestamp."""
    origin = datetime.datetime(1970, 1, 1)
    if indate.tzinfo:
        origin = pytz.timezone('UTC').localize(origin)
    return (indate - origin).total_seconds()

class NacrTrafficService(TrafficService):
    """Exposes traffic data for Nacr.us as service."""
    def __init__(self):
        """Initialize self."""
        source_url = "http://lelandbatey.com/netinfo/local.vnstat.log"
        self.source_url = source_url
        self.source_label = "nacr.us"
        self.date_fmt = "%m/%d/%y"

    def get_traffic(self):
        """Returns parsed form of traffic data from 'self.source_url'"""
        req = requests.get(self.source_url)
        text = req.text
        interface, rv = self.parse_traffic(text)
        host = ", ".join([self.source_label, interface])
        return host, rv

    def parse_traffic(self, text):
        """Parse the output of vnstat into the data we desire."""
        interface = text.splitlines()[1].split('/')[0].strip()
        # pprint(interface)
        raw_entries = []
        for line in text.splitlines():
            if '/s' in line:
                line = line.replace('|', '')
                line = [l.strip() for l in line.split('  ') if len(l) > 0]
                raw_entries.append((line[0], line[-1]))

        holder = {}
        entries = []

        for date_str, rate in raw_entries:
            date = datetime.datetime.strptime(date_str, self.date_fmt)
            epoch = datetime_to_epoch(date)

            rate, unit = rate.split(' ')
            holder['unit'] = unit
            entries.append({'timestamp': epoch, "rate": float(rate)})
        holder['data'] = entries

        return interface, holder



