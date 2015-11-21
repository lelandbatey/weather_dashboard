
from .nacr_traffic_service import NacrTrafficService
from .laptop_traffic_service import LaptopTrafficService


def get_all_traffic():
    """Returns traffic from all traffic services."""
    services = [NacrTrafficService, LaptopTrafficService]

    traffic = {}
    for serv in services:
        label, data = serv()()
        traffic[label] = data

    return traffic


