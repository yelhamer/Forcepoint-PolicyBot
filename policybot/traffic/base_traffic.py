import abc
from typing import Iterator, List
from ipaddress import IPv4Address, IPv6Address


class Packet(abc.ABC):
    def __init__(self) -> None:
        super().__init__()

    @property
    @abc.abstractmethod
    def source_ip(self) -> IPv4Address | IPv6Address:
        raise NotImplementedError()

    @property
    @abc.abstractmethod
    def destination_ip(self) -> IPv4Address | IPv6Address:
        raise NotImplementedError()

    @property
    @abc.abstractmethod
    def source_port(self) -> int:
        raise NotImplementedError()

    @property
    @abc.abstractmethod
    def destination_port(self) -> int:
        raise NotImplementedError()


class Traffic(abc.ABC):
    def __init__(self, traffic: List) -> None:
        super().__init__()
        # this is just to highlight the composition relation between
        # the LogEntry and TrafficLog classes.
        self.connections = [Packet(entry) for entry in traffic]

    @property
    @abc.abstractmethod
    def connections(self) -> Iterator[Packet]:
        raise NotImplementedError()