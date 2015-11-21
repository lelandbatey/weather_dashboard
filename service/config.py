# -*- coding: utf-8 -*-
"""Exposes configuration information to app."""

from __future__ import print_function
from os.path import join, dirname, realpath, exists
import json

def get_config():
	"""Returns a dictionary of all the configuration keys available.
	Configuration data is stored in the 'config.json' file next to this python
	file."""
	config = None
	config_path = join(dirname(realpath(__file__)), "config.json")
	if not exists(config_path):
		raise ValueError("The 'config.json' file does not exist. "
				         "Please create it and populate it with the correct "
						 "API information.")
	with open(config_path, 'r') as conf_file:
		config = json.load(conf_file)
	return config

CONFIGURATION = get_config()

if __name__ == "__main__":
	get_config()

