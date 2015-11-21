# -*- coding: utf-8 -*-
"""Tests for nacr_traffic_service"""

from __future__ import print_function
from .nacr_traffic_service import NacrTrafficService
import unittest




class TestNacrBase(unittest.TestCase):
    """Test that Nacr class has some implementation."""

    def test_mock_methods(self):
        """Test that no methods raise NotImplemented, and returns some truthy value"""
        print(NacrTrafficService().get_traffic())
        self.assertTrue(NacrTrafficService().get_traffic())


if __name__ == '__main__':
    unittest.main()
