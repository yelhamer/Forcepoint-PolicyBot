from generators.base_generator import BaseGenerator
from models.traffic.forcepoint import ForcePointTrafficLog
from models.rules.forcepoint import ForcePointRuleSet, ForcepointRule

class ForcepointGenerator(BaseGenerator):
    def __init__(self, traffic: ForcePointTrafficLog) -> None:
        self.traffic = traffic

    def generate_rules(self, *options) -> ForcePointRuleSet:
        rules = [ForcepointRule(**{"Source": ["192.168.1.1"], "Destination": ["192.168.1.0"], "Service": [("TCP", 80)], "Action": "allow"})]
        return ForcePointRuleSet(rules)