from enum import Enum
from pydantic import BaseModel, RootModel, Field, field_validator
from typing import List, Union, Optional, Tuple
from pydantic.networks import IPvAnyAddress, IPvAnyNetwork

class ActionsEnum(str, Enum):
    pass

class BaseRule(BaseModel):
    name: str
    order: int
    src_addrs: Union[IPvAnyAddress, IPvAnyNetwork]
    dst_addrs: Union[IPvAnyAddress, IPvAnyNetwork]
    src_ports: Optional[List[int]] = None
    # first element is the service name (DNS, HTTPS, TCP, etc.)
    # second element is the destination port number
    services: List[Tuple[str, int]] = Field(min_length=1)
    action: ActionsEnum

    @field_validator("services")
    @classmethod
    def validate_ports(cls, port):
        for service, port in port:
            if port not in range(0, 65536):
                raise ValueError(f"port {port} for service {service} is not a valid port number")
        return port


class BaseRuleSet(RootModel):
    root: List[BaseRule]

    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]