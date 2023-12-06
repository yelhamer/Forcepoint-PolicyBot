from pydantic import BaseModel, field_validator
from pydantic.networks import IPvAnyAddress
from datetime import datetime
from typing import Optional, List

class ForcePointLogEntry(BaseModel):
    Timestamp: datetime
    LogId: int
    NodeId: str
    Facility: str
    Type: str
    Event: str
    Action: str
    Src: IPvAnyAddress
    Dst: IPvAnyAddress
    Service: str
    Protocol: str
    Sport: int
    Dport: int
    RuleId: float
    Srcif: int
    SrcVlan: int
    ReceptionTime: datetime
    SenderType: str
    SituationId: int
    Situation: str
    EventId: int

    @field_validator('Sport', 'Dport')
    @classmethod
    def validate_port(cls, p: int):
        if p not in range(0, 65536):
            raise ValueError(f"{p} is not a valid port")
        return p
    

class ForcePointLog(BaseModel):
    entries: Optional[List[ForcePointLogEntry]] = None