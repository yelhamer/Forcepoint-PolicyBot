from generators.base_generator import BaseGenerator
from models.traffic.forcepoint import ForcePointTrafficLog
from models.rules.forcepoint import ForcePointRuleSet, ForcepointRule, ExternalNetwork, AnyNetwork, AnyPort, NetworksEnum
from pydantic.networks import IPv4Address
import itertools


class SecondGenerator(BaseGenerator):
    def __init__(self, traffic: ForcePointTrafficLog, subnet_creation_threshhold: int = 4) -> None:
        self.traffic = traffic
        self.subnet_creation_threshhold = subnet_creation_threshhold

    def generate_rules(self, *options) -> ForcePointRuleSet:
        ip_count = {ExternalNetwork: 0}
        for packet in self.traffic:
            # set external IPs
            if packet.dst_ip.is_global:
                packet.dst_ip = ExternalNetwork
            elif packet.dst_ip in ip_count:
                ip_count[packet.dst_ip] += 1
            else:
                ip_count[packet.dst_ip] = 1

            if packet.src_ip.is_global:
                packet.src_ip = ExternalNetwork
            elif packet.src_ip in ip_count:
                ip_count[packet.src_ip] += 1
            else:
                ip_count[packet.src_ip] = 1

        for packet in self.traffic:
            if ip_count[packet.src_ip] > self.subnet_creation_threshhold:
                packet.src_ip = packet.src_ip.supernet(new_prefix=24)
            if ip_count[packet.dst_ip] > self.subnet_creation_threshhold:
                packet.dst_ip = packet.dst_ip.supernet(new_prefix=24)
 
        traffic_by_dst = dict()
        for packet in self.traffic:
            if packet.dst_ip not in traffic_by_dst:
                traffic_by_dst[packet.dst_ip] = set([packet])
            else:
                traffic_by_dst[packet.dst_ip].add(packet)

        for dst, packets in traffic_by_dst.items():
            traffic_by_port = dict()
            for packet in packets:
                if packet.dst_port not in traffic_by_port:
                    traffic_by_port[packet.dst_port] = set([packet])
                else:
                    traffic_by_port[packet.dst_port].add(packet)
            traffic_by_dst[dst] = traffic_by_port


        rules = []
        for dst, traffic_by_port in traffic_by_dst.items():
            for port, packets in traffic_by_port.items():
                s = list(map(lambda x: x.src_ip, packets))
                rule = ForcepointRule(Source=s, Destination=[dst], Service=[("TCP", port)], Action="allow")
                rules.append(rule)

        rules_by_dst_and_port = dict()
        for rule in rules:
            if (rule.dst_addrs[0], rule.services[0]) not in rules_by_dst_and_port:
                rules_by_dst_and_port[(rule.dst_addrs[0], rule.services[0])] = [rule]
            else:
                rules_by_dst_and_port[(rule.dst_addrs[0], rule.services[0])].append(rule)

        rules_by_src = dict()
        for rule in rules:
            if tuple(rule.src_addrs) not in rules_by_dst_and_port:
                rules_by_src[tuple(rule.src_addrs)] = [rule]
            else:
                rules_by_src[tuple(rule.src_addrs)].append(rule)

        new_rules = []
        for dst_and_port, n_rules in rules_by_dst_and_port.items():
            dst, svc = dst_and_port
            sources = list(map(lambda r: r.src_addrs, n_rules))
            sources = list(itertools.chain.from_iterable(sources))
            rule = ForcepointRule(Source=sources, Destination=[dst], Service=[svc], Action="allow")
            new_rules.append(rule)

        rules = new_rules
        rules_by_src = dict()
        for rule in rules:
            if tuple(rule.src_addrs) not in rules_by_src:
                rules_by_src[tuple(rule.src_addrs)] = [rule]
            else:
                rules_by_src[tuple(rule.src_addrs)].append(rule)

        new_rules = []
        for srcs, n_rules in rules_by_src.items():
            dsts = list(map(lambda r: r.dst_addrs, n_rules))
            dsts = list(set(itertools.chain.from_iterable(dsts)))
            for i, net in enumerate(dsts):
                if isinstance(net, str):
                    continue
                if net.prefixlen == 32:
                    dsts[i] = net.network_address
            svcs = list(map(lambda r: r.services, n_rules))
            svcs = list(set(itertools.chain.from_iterable(svcs)))
            srcs = list(set(srcs))
            for i, net in enumerate(srcs):
                if isinstance(net, str):
                    continue
                if net.prefixlen == 32:
                    srcs[i] = net.network_address
            rule = ForcepointRule(Source=srcs, Destination=dsts, Service=svcs, Action="allow")
            new_rules.append(rule)

        new_rules.append(ForcepointRule(Source=[AnyNetwork], Destination=[AnyNetwork], Service=[AnyPort], Action="discard"))


        return ForcePointRuleSet(new_rules)


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
                packet.dst_ip = ExternalNetwork

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


        traffic_by_dst = dict()
        for port, packets in traffic_by_port.items():
            if packets not in traffic_by_dst:
                traffic_by_dst[packets] = (port,)
            else:
                traffic_by_dst[packets] += (port,)


        rules = []
        for port, packets in traffic_by_port.items():
            s = list(map(lambda x: x.src_ip, packets))
            d = list(map(lambda x: x.dst_ip, packets))
            rules.append(ForcepointRule(Source=s, Destination=d, Service=[("TCP", port)], Action="allow"))

        return rules

