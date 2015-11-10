# -*- coding: utf-8 -*-
"""Connect weather service to WSGI app, exposing the app."""

from __future__ import print_function
from frontend import flask_component as wsgi_app
from weather_service import get_all_weather
from traffic_service import get_all_traffic

wsgi_app.set_weather_service(get_all_weather)
wsgi_app.set_traffic_service(get_all_traffic)
APP = wsgi_app.APP

if __name__ == '__main__':
	APP.run(debug=True, host="0.0.0.0")

