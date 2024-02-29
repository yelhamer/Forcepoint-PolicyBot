from abc import ABC
from pydantic import BaseModel
from models.traffic.base_traffic import BaseTrafficLog
from models.rules.base_rule import BaseRuleSet

class BaseGenerator(ABC):
    def __init__(self, traffic: BaseTrafficLog) -> None:
        self.traffic = traffic

    def generate_rules(self, *options) -> BaseRuleSet:
        raise NotImplementedError()