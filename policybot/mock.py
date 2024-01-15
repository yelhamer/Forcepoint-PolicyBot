from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from typing import List
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
    src_port: int
    dst_port: int
    service: str
    action: Action


@app.post("/upload/forcepoint/")
async def upload_traffic(traffic: List[ForcePointLogEntry]):
    rules = [ForcePointRule(priority=0, src_ip="192.168.1.0/24", dst_ip="192.168.2.0/24", src_port=4545, dst_port=80, service="http", action="allow"),
            ForcePointRule(priority=0, src_ip="192.168.1.0/24", dst_ip="192.168.2.0/24", src_port=4545, dst_port=443, service="https", action="deny")]
    return rules

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
