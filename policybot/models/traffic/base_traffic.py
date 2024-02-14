import abc
from pydantic import BaseModel, RootModel, Field
from typing import List
from pydantic.networks import IPvAnyAddress


class BaseLogEntry(BaseModel, abc.ABC):
    src_ip: IPvAnyAddress
    dst_ip: IPvAnyAddress
    src_port: int
    dst_port: int
    service: str


class BaseTrafficLog(RootModel, abc.ABC):
    root: List[BaseLogEntry]

    def __iter__(self):
        return iter(self.root)

    def __getitem__(self, item):
        return self.root[item]