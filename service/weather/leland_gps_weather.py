# -*- coding: utf-8 -*-
"""Gathers and caches weather data."""

from __future__ import print_function
from .weather import Weather, ensure_default_weather
from ..config import CONFIGURATION
import requests



class LelandGpsWeather(Weather):
    """Returns weather information for the current location of Leland Batey.
    Current location is retrieved from 'whereis.lelandbatey.com/currentpos',
    while current weather data is retrieved from openweathermap.org."""
    def __init__(self):
        """Initialize self, set lookup locations."""
        self.source_label = "leland_gps"

        gps_source_url = "http://whereis.lelandbatey.com/currentpos"
        self.gps_source_url = gps_source_url

        weather_base_url = "http://api.openweathermap.org/data/2.5/weather"
        self.weather_base_url = weather_base_url

        self.weather_api_key = CONFIGURATION['OPEN_WEATHER_MAP_API_KEY']

    def get_leland_location(self):
        """Returns a dictionary with lat/long entries for Leland Batey's
        current position."""
        req = requests.get(self.gps_source_url)
        return {"lat": req.json()['latitude'],
                "lon": req.json()['longitude']}

    def get_location_weather(self):
        """Get the current weather for the current GPS locaiton."""
        payload = self.get_leland_location()
        payload['appid'] = self.weather_api_key
        # The API defaults to metric, so set the option to return measurements
        # in imperial units instead
        payload['units'] = 'imperial'
        req = requests.get(self.weather_base_url, params=payload)
        return req.json()


    def get_weather(self):
        """Return weather data for the current GPS location, formatted to be
        passed on to the client."""
        to_ret = {}
        weather = self.get_location_weather()

        to_ret['relative_humidity'] = weather['main']['humidity']
        to_ret['temperature'] = weather['main']['temp']
        to_ret['wind_speed'] = weather['wind']['speed']
        to_ret['wind_direction'] = weather['wind']['deg']
        to_ret['text'] = str(weather)
        
        return self.source_label, to_ret



from pprint import pprint
if __name__ == "__main__":
    pprint(LelandGpsWeather().get_location_weather())
    pprint(LelandGpsWeather().get_weather())


