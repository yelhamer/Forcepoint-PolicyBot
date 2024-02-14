from typing import Dict, Iterator, List
from ipaddress import IPv4Address, IPv6Address

from policybot.formats.traffic.forcepoint.models import ForcePointTrafficLog, ForcePointLogEntry
from policybot.formats.traffic.base_traffic_log import Traffic, Packet


class ForcepointPacket(Packet):
    def __init__(self, entry: ForcePointLogEntry) -> None:
        super().__init__()
        self.entry: ForcePointLogEntry = entry

    @property
    def src_ip(self) -> IPv4Address | IPv6Address:
        return self.entry.Src

    @property
    def dst_ip(self) -> IPv4Address | IPv6Address:
        return self.entry.Dst
    
    @property
    def src_port(self) -> int:
        return self.entry.Sport
    
    @property
    def dst_port(self) -> int:
        return self.entry.Dport


class ForcepointTraffic(Traffic):
    def __init__(self, traffic: ForcePointTrafficLog) -> None:
        super().__init__()
        self.connections: List[ForcepointPacket] = [
            ForcepointPacket(entry) for entry in traffic.entries
        ]

    @property
    def connections(self) -> Iterator[ForcepointPacket]:
        yield from self.connections

    @classmethod
    def from_json(cls, traffic_log: Dict) -> "ForcepointTraffic":
        tl = cls(traffic=ForcePointTrafficLog(entries=traffic_log))
        return tl