from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import Any, List
import json
import uvicorn
from enum import Enum
from pydantic import BaseModel, field_validator
from formats.traffic.forcepoint.models import ForcePointLogEntry
from pydantic.networks import IPvAnyNetwork, IPvAnyAddress

app = FastAPI()

class Action(str, Enum):
    ALLOW = "allow"
    DENY = "deny"
    BLOCK = "block"

class PortRange(BaseModel):
    start: int
    end: int

    @field_validator('start', 'end')
    @classmethod
    def validate_port(cls, port: int):
        if port not in range(0, 65536):
            raise ValueError(f"{port} is not a valid port number.")
        return port

class ForcePointRule(BaseModel):
    priority: int
    src_ip: IPvAnyNetwork | IPvAnyAddress
    dst_ip: IPvAnyNetwork | IPvAnyAddress
    src_port: str
    dst_port: str
    service: str
    action: Action

    @field_validator('src_port', 'dst_port')
    @classmethod
    def validate(cls, value: str):
        if "-" in value:
            try:
                low, high = map(int, value.split("-"))
            except:
                raise ValueError(f"Port number must be an interger")
            if low not in range(0, 65536):
                raise ValueError(f"{low} is not a valid port number.")
            if high not in range(0, 65536):
                raise ValueError(f"{high} is not a valid port number.")
            if low >= high:
                raise ValueError(f"The port range must be from the lowest to the highest end")
        else:
            try:
                port = int(port)
            except ValueError:
                raise ValueError(f"port number must be an integer")
            if port not in range(0, 65536):
                raise ValueError(f"{port} is not a valid port number.")

        return value



@app.post("/upload/forcepoint/")
async def upload_traffic(traffic: List[ForcePointLogEntry]):
    rules = [ForcePointRule(priority=0, src_ip="192.168.1.0/24", dst_ip="192.168.2.0/24", src_port="4545", dst_port=80, service="http", action="allow"),
            ForcePointRule(priority=0, src_ip="192.168.1.0/24", dst_ip="192.168.2.0/24", src_port="123-4124", dst_port=443, service="https", action="deny")]
    return rules

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
