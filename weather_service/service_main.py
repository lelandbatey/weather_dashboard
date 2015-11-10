"""Exposes all weather services through single function."""
from .richland_weather import RichlandWeather


def get_all_weather():
    """Returns weather_data from all weather services."""
    services = [RichlandWeather]

    weather_data = {}
    for serv in services:
        label, data = serv()()
        weather_data[label] = data

    return weather_data

