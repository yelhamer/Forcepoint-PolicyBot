import abc
from pydantic import BaseModel, RootModel
from typing import Set
from pydantic.networks import IPvAnyNetwork


class BaseLogEntry(BaseModel, abc.ABC):
    src_ip: IPvAnyNetwork
    dst_ip: IPvAnyNetwork
    src_port: int
    dst_port: int
    service: str

    def __eq__(self, other: "BaseLogEntry") -> bool:
        return (self.src_ip == other.src_ip
            and self.dst_ip == other.dst_ip
            and self.dst_port == other.dst_port
            and self.service == other.service)

    def __hash__(self) -> int:
        return hash((self.src_ip, self.dst_ip, self.dst_port, self.service))


class BaseTrafficLog(RootModel, abc.ABC):
    root: Set[BaseLogEntry]

    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]