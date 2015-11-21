# -*- coding: utf-8 -*-
"""Test richland weather"""

from __future__ import print_function
from .richland_weather import RichlandWeather
import unittest

SAMPLE_DATA = "".join('\r\n'
' Station# 11  (300A) at 390 ft above MSL     \r\n'
'\r\n'
' Time: 15:15:00 PST      Date: 11/4/2015\r\n'
'\r\n'
' Ave Wind Direction 60m = 206    Ave Temp 60m = 52.0\r\n'
' Ave Wind Speed 60m     =  13\r\n'
' Ave Wind Direction 25m = 208\r\n'
' Ave Wind Speed 25m     =  12\r\n'
' Ave Wind Direction 10m = 206    Ave Temp 10m = 53.1\r\n'
' Ave Wind Speed 10m     =  11\r\n'
' Max Wind Speed 10m     =  18\r\n'
'\r\n'
' Ave BP = 29.664 in/Hg     753.492 mm/Hg\r\n'
' Max BP = 29.665 in/Hg     753.503 mm/Hg\r\n'
' Min BP = 29.664 in/Hg     753.473 mm/Hg\r\n'
'\r\n'
' Ave SLP= 30.105 in/Hg    1019.478 mbs\r\n'
'\r\n'
' Ave Temp 2m = 53.7        Dew-Point 2m = 28.7\r\n'
' Max Temp 2m = 54.0        Rel-Humidity = 38.0\r\n'
' Min Temp 2m = 53.4\r\n'
' Delta Temp 60m-10m = -1.15\r\n'
'\r\n'
' Rain Gauge = 0.00\r\n'
'\r\n')

SAMPLE_DATA_TWO = "".join('\r\n'
' Station# 11  (300A) at 390 ft above MSL     \r\n'
'\r\n'
' Time: 14:00:00 PST      Date: 11/17/2015\r\n'
'\r\n'
' Ave Wind Direction 60m = -999    Ave Temp 60m = -999.0\r\n'
' Ave Wind Speed 60m     = -999\r\n'
' Ave Wind Direction 25m = -999\r\n'
' Ave Wind Speed 25m     = -999\r\n'
' Ave Wind Direction 10m = -999    Ave Temp 10m = -999.0\r\n'
' Ave Wind Speed 10m     = -999\r\n'
' Max Wind Speed 10m     = -999\r\n'
'\r\n'
' Ave BP = -999.000 in/Hg     -25375.100 mm/Hg\r\n'
' Max BP = -999.000 in/Hg     -25375.100 mm/Hg\r\n'
' Min BP = -999.000 in/Hg     -25375.100 mm/Hg\r\n'
'\r\n'
' Ave SLP= -998.559 in/Hg    -33815.103 mbs\r\n'
'\r\n'
' Ave Temp 2m = -999.0        Dew-Point 2m = -999.0\r\n'
' Max Temp 2m = -999.0        Rel-Humidity = 100.0\r\n'
' Min Temp 2m = -999.0\r\n'
' Delta Temp 60m-10m = -999.00\r\n'
'\r\n')

from pprint import pprint


class TestRichlandWeatherGetWeather(unittest.TestCase):
    """Test RichlandWeather methods has correct formats"""

    def setUp(self):
        """Setup temp instance of RichlandWeather"""
        self.rw = RichlandWeather()

    def test_return_type(self):
        """Ensure the `get_weather` method returns dictionary"""
        service_name, ret = self.rw.get_weather()
        self.assertIsInstance(ret, dict)
        self.assertIsInstance(service_name, str)

    def test_return_keys(self):
        """Check the keys of the dict returned by `get_weather`"""
        required_keys = ['text', 'temperature', 'wind_speed', 'wind_direction',
                         'relative_humidity']
        service_name, ret = self.rw.get_weather()
        for rk in required_keys:
            self.assertTrue(rk in ret)

class TestParseHMS(unittest.TestCase):
    """Test the parsing of the HMS data."""

    def setUp(self):
        """Setup temp data and RW instance"""
        self.rw = RichlandWeather()
        self.text = SAMPLE_DATA_TWO

    def test_parse_type(self):
        """Test parsing of HMS data"""
        ret = self.rw.parse_hms_data(self.text)
        self.assertIsInstance(ret, dict)

    def test_extract_len(self):
        """Test length of return of extract_readings"""
        ret = self.rw.extract_readings(self.text)
        self.assertEqual(len(ret), self.text.count('='))

    def test_parse_odd_fields(self):
        """Test for 'readings' fields in return of parse."""
        ret = self.rw.parse_hms_data(self.text)
        self.assertTrue('readings' in ret)

    def test_datetime_type(self):
        """Test type of extraction of datetime from HMS data"""
        ret = self.rw.extract_datetime(self.text)
        self.assertIsInstance(ret, float)

    def test_extract_datetime(self):
        """Test extraction and parsing of datetime."""
        times = [("Time: 10:10:10 PDT   Date: 10/10/2015\n", 1444497010),
                 ("Time: 11:11:11 PST   Date: 11/11/2015", 1447269071)]
        for time_str, gmt_time in times:
            self.assertEqual(self.rw.extract_datetime(time_str), gmt_time)


if __name__ == '__main__':
    unittest.main()
