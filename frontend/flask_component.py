# -*- coding: utf-8 -*-
"""Flask-based frontend for weather service."""

from __future__ import print_function
from os.path import join, dirname, realpath
import jsonpickle
import flask

# Set encoding options so jsonpickle will pretty-print it's output
jsonpickle.set_preferred_backend('json')
jsonpickle.set_encoder_options('json', sort_keys=True,
                               indent=4, separators=(',', ': '))

APP = flask.Flask(__name__,
                  template_folder=join(dirname(realpath(__file__)), "templates"),
                  static_folder=join(dirname(realpath(__file__)), "static"))

APP.config.update({"WEATHER_SERVICE": None})

def set_weather_service(weather_service_class):
    """Expose a function so the weather_service can be set from an external
    source."""
    APP.config["WEATHER_SERVICE"] = weather_service_class


def make_json_response(in_data):
    """Returns a proper json response from the data passed in."""
    if not isinstance(in_data, str):
        in_data = jsonpickle.encode(in_data)
    response = flask.make_response(in_data)
    response.headers["Content-type"] = "application/json"
    return response



@APP.route('/')
def root():
    """Serve the homepage for root requests."""
    return flask.render_template('homepage.html')

@APP.route('/api/weather')
def get_weather():
    """Serve the weather data on the api."""
    service = APP.config["WEATHER_SERVICE"]()
    weather_data = service.get_weather()
    return make_json_response(weather_data)



@APP.route('/favicon.ico')
def favicon():
    """Serve something so the favicon request doesn't 404"""
    return ""


