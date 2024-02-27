from generators.base_generator import BaseGenerator
from models.traffic.forcepoint import ForcePointTrafficLog
from models.rules.forcepoint import ForcePointRuleSet, ForcepointRule
from pydantic.networks import IPv4Address

class ForcepointGenerator(BaseGenerator):
    def __init__(self, traffic: ForcePointTrafficLog) -> None:
        self.traffic = traffic

    def generate_rules(self, *options) -> ForcePointRuleSet:
        traffic_by_port = dict()

        subnets = dict()
        for packet in self.traffic:
            network = packet.src_ip.supernet(new_prefix=24)
            if network not in subnets:
                subnets[network] = [packet]
            else:
                subnets[network].append(packet)
            
            if packet.dst_ip.is_global:
                packet.dst_ip = IPv4Address('0.0.0.0')

        for net, packets in subnets.items():
            if len(packets) > 3:
                for packet in packets:
                    if packet.src_ip.subnet_of(net):
                        packet.src_ip = net
                    else:
                        packet.dst_ip = net

        for packet in self.traffic:
            if packet.dst_port not in traffic_by_port:
                traffic_by_port[packet.dst_port] = (packet,)
            else:
                traffic_by_port[packet.dst_port] += (packet,)

        print(traffic_by_port)

        traffic_by_dst = dict()
        for port, packets in traffic_by_port.items():
            if packets not in traffic_by_dst:
                traffic_by_dst[packets] = (port,)
            else:
                traffic_by_dst[packets] += (port,)


        from itertools import chain

        print(f"{len(self.traffic.root)}: {len(traffic_by_port)}: {len(traffic_by_dst)}")

        rules = []
        for port, packets in traffic_by_port.items():
            s = list(map(lambda x: x.src_ip, packets))
            d = list(map(lambda x: x.dst_ip, packets))
            rules.append(ForcepointRule(Source=s, Destination=d, Service=[("TCP", port)], Action="allow"))

        return rules
