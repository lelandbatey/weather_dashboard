# -*- coding: utf-8 -*-
"""Base class for traffic services."""


class TrafficService(object):
	"""Abstract base class for all TrafficServices."""
	def get_traffic(self):
		"""Not implemented."""
		raise NotImplementedError("get_traffic() not implemented.")
	def __call__(self):
		"""Passthrough to the "get_traffic" method. Done to allow uniform
		access by service_main.py to each service."""
		return self.get_traffic()

