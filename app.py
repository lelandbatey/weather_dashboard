# -*- coding: utf-8 -*-
"""Connect weather service to WSGI app, exposing the app."""

from __future__ import print_function
from frontend import flask_component as wsgi_app
from weather_service import RichlandWeather as weather_service

wsgi_app.set_weather_service(weather_service)
APP = wsgi_app.APP

if __name__ == '__main__':
	APP.run(debug=True, host="0.0.0.0")

