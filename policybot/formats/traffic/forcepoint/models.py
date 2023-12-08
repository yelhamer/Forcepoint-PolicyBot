from pydantic import BaseModel, field_validator
from pydantic.networks import IPvAnyAddress
from datetime import datetime
from typing import List

class ForcePointLogEntry(BaseModel):
    Timestamp: datetime
    ReceptionTime: datetime
    LogId: int
    NodeId: str
    Facility: str
    Type: str
    Event: str
    Action: str
    Src: IPvAnyAddress
    Dst: IPvAnyAddress
    Sport: int
    Dport: int
    Service: str
    Protocol: str
    RuleId: float
    Srcif: int
    SrcVlan: int
    SenderType: str
    SituationId: int
    Situation: str
    EventId: int

    @field_validator('Sport', 'Dport')
    @classmethod
    def validate_port(cls, port: int):
        if port not in range(0, 65536):
            raise ValueError(f"{port} is not a valid port number.")
        return port


class ForcePointTrafficLog(BaseModel):
    entries: List[ForcePointLogEntry]