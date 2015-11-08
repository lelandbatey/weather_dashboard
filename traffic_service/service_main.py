
from .nacr_traffic_service import NacrTrafficService


def get_all_traffic():
    """Returns traffic from all traffic services."""
    services = [NacrTrafficService]

    traffic = {}
    for serv in services:
        label, data = serv().get_traffic()
        traffic[label] = data

    return traffic


