# -*- coding: utf-8 -*-
"""Test base weather"""

from __future__ import print_function
from .weather import Weather
import unittest


class TestWeatherBase(unittest.TestCase):
    """Test that Weather class has no implementation."""

    def test_mock_methods(self):
        """Test that all Weather methods raise NotImplemented"""
        self.assertRaises(NotImplementedError, Weather().get_weather)


if __name__ == '__main__':
    unittest.main()
