# -*- coding: utf-8 -*-
"""Gather traffic data for nacr.us"""

from __future__ import print_function
from functools import wraps
from .nacr_traffic_service import NacrTrafficService



class LaptopTrafficService(NacrTrafficService):
    """Exposes traffic data from my laptop as service."""
    def __init__(self):
        """Initialize self."""
        source_url = "http://lelandbatey.com/netinfo/tp300la_vnstat.log"
        self.source_url = source_url
        self.source_label = "laptop"
        self.date_fmt = "%m/%d/%Y"



