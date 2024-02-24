from pydantic import field_validator, Field
from pydantic.networks import IPvAnyNetwork
from datetime import datetime
from typing import Set, List
from models.traffic.base_traffic import BaseLogEntry, BaseTrafficLog


class ForcePointLogEntry(BaseLogEntry):
    src_ip: IPvAnyNetwork = Field(alias="Src")
    dst_ip: IPvAnyNetwork = Field(alias="Dst")
    src_port: int = Field(alias="Sport")
    dst_port: int = Field(alias="Dport")
    service: str = Field(alias="Service")
    # the fields below are listed to assure that the provided
    # log file is indeed from the Forcepoint NGFW
    Timestamp: datetime
    ReceptionTime: datetime
    LogId: int
    NodeId: str
    Facility: str
    Type: str
    Event: str
    Action: str
    Protocol: str
    RuleId: float
    Srcif: int
    SrcVlan: int
    SenderType: str
    SituationId: int
    Situation: str
    EventId: int

    @field_validator('src_port', 'dst_port')
    @classmethod
    def validate_port(cls, port: int):
        if port not in range(0, 65536):
            raise ValueError(f"{port} is not a valid port number.")
        return port

    def __eq__(self, other) -> bool:
        return super().__eq__(other)

    def __hash__(self) -> int:
        return hash((self.src_ip, self.dst_ip, self.src_port, self.dst_port, self.service))


class ForcePointTrafficLog(BaseTrafficLog):
    root: Set[ForcePointLogEntry]
