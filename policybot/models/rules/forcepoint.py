from models.rules.base_rule import BaseRuleSet, ActionsEnum
from pydantic import BaseModel, Field
from typing import List, Union, Tuple, Dict
from pydantic.networks import IPvAnyAddress, IPvAnyNetwork, IPv4Address

class ForcepointActions(ActionsEnum):
    ALLOW = "allow"
    CONTINUE = "continue"
    DISCARD = "discard"
    REFUSE = "refuse"

class ForcepointRule(BaseModel):
    src_addrs: List[Union[IPvAnyAddress, IPvAnyNetwork]] = Field(alias="Source")
    dst_addrs: List[Union[IPvAnyAddress, IPvAnyNetwork]] = Field(alias="Destination")
    # first element is the service name (DNS, HTTPS, TCP, etc.)
    # second element is the destination port number
    services: List[Tuple[str, int]] = Field(alias="Service", min_length=1)
    action: ForcepointActions = Field(alias="Action")


    def get_addresses(self):
        for addr in (self.src_addrs + self.dst_addrs):
            if isinstance(addr, IPv4Address):
                yield addr
            elif isinstance(addr, IPvAnyNetwork):
                continue
            else:
                raise TypeError("source address can be either an ip or a network")
        
    def get_networks(self):
        for addr in (self.src_addrs + self.dst_addrs):
            if isinstance(addr, IPvAnyAddress):
                continue
            elif isinstance(addr, IPvAnyNetwork):
                yield addr
            else:
                raise TypeError("source address can be either an ip or a network")

    def get_services(self):
        yield from self.services

    def to_xml(self, name: str, rank: int, addr_refs: Dict[Union[IPvAnyAddress, IPvAnyNetwork], str], service_refs: Dict[Tuple[str, int], str]) -> str:
        sources = []
        destinations = []
        services = []
        preamble = [f"      <rule_entry name=\"{name}\" is_disabled=\"false\" parent_rule-ref=\"Access rule: insert point\" rank=\"{rank}\">", "        <access_rule>", "          <match_part>"]
        postamble = ["          </match_part>", "        </access_rule>", "      </rule_entry>"]
        for addr in self.src_addrs:
            sources.append(f"              <match_source_ref type=\"network_element\" value=\"{addr_refs[addr]}\"/>")
        for addr in self.dst_addrs:
            destinations.append(f"              <match_destination_ref type=\"network_element\" value=\"{addr_refs[addr]}\"/>")
        for service in self.services:
            services.append(f"              <match_service_ref type=\"service\" value=\"{service_refs[service]}\"/>")

        sources = ["            <match_sources>"] + sources + ["            </match_sources>"]
        destinations = ["            <match_destinations>"] + destinations + ["            </match_destinations>"]
        services = ["            <match_services>"] + services + ["            </match_services>"]
        actions = [f"            <action type=\"{self.action}\">"]

        return "\n".join(preamble+sources+destinations+services+actions+postamble)



class ForcePointRuleSet(BaseRuleSet):
    root: List[ForcepointRule]


    def get_all_addr_refs(self) -> Dict[Union[IPvAnyAddress, IPvAnyNetwork], str]:
        addrs = set()
        addr_refs = dict()

        for rule in self.root:
            addrs.update(rule.get_addresses())

        for addr in addrs:
            if isinstance(addr, IPv4Address):
                addr_refs[addr] = f"{addr}"
            elif isinstance(addr, IPvAnyNetwork):
                addr_refs[addr] = f"network-{addr}"
            else:
                print(addr)
                raise TypeError(f"{addr} is not a valid address")
            
        return addr_refs

    def get_all_service_refs(self) -> Dict[Tuple[str, int], str]:
        services = set()
        service_refs = dict()

        for rule in self.root:
            services.update(rule.get_services())

        for service in services:
            service_refs[service] = "/".join(map(str, service))

        return service_refs

    def to_xml(self, rule_name="test_policy") -> str:
        hosts = []
        networks = []
        services = []
        rules = []
        preamble = ["<?xml version='1.0' encoding='UTF-8' ?>",
               "<DOCTYPE generic_import_export SYSTEM \"generic_import_export_v7.0.dtd\">",
               "<generic_import_export build=\"11323\" update_package_version=\"1568\">",
               ]
        postamble = ["</generic_import_export>"]
        rules = []
        policy = []

        addr_refs = self.get_all_addr_refs()
        service_refs = self.get_all_service_refs()
        
        for addr, name in addr_refs.items():
            if isinstance(addr, IPv4Address):
                hosts.append(f"  <host name=\"{name}\">\n    <mvia_address address={addr}/>\n  </host>")
            elif isinstance(addr, IPvAnyNetwork):
                networks.append(f"  <network ipv{addr.version}_network={addr} name=\"{name}\"/>")
            else:
                raise TypeError(f"{addr} is not a valid address")
            
        for service, name in service_refs.items():
            services.append(f"  <service_tcp name=\"{name}\" min_dst_port=\"{service[1]}\">")

        for i, rule in enumerate(self.root, start=1):
            rules.append(rule.to_xml(name=f"{rule_name}-{i}", rank=i, addr_refs=addr_refs, service_refs=service_refs))
        
        policy.append(f"  <fw_policy name=\"{rule_name}\">")
        policy.append("    <access_entry>")
        policy = policy + rules
        policy.append("    </access_policy>")
        policy.append("  </fw_policy>")

        rule_xml = preamble + policy + networks + hosts + services + postamble

        return "\n".join(rule_xml)



