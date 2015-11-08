# -*- coding: utf-8 -*-
"""Base class for traffic services."""


class TrafficService(object):
	"""Abstract base class for all TrafficServices."""
	def get_traffic(self):
		"""Not implemented."""
		raise NotImplementedError("get_traffic() not implemented.")

