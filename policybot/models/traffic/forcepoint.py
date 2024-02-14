from pydantic import field_validator, Field
from pydantic.networks import IPvAnyAddress
from datetime import datetime
from typing import List
from models.traffic.base_traffic import BaseLogEntry, BaseTrafficLog


class ForcePointLogEntry(BaseLogEntry):
    src_ip: IPvAnyAddress = Field(alias="Src")
    dst_ip: IPvAnyAddress = Field(alias="Dst")
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


class ForcePointTrafficLog(BaseTrafficLog):
    root: List[ForcePointLogEntry]
