import json
import xml.etree.ElementTree as ET
from io import BytesIO


def generate_policy(firewall_rules):
    # Create the root element
    root = ET.Element("generic_import_export", build="11323", update_package_version="1568")
    fw_policy = ET.SubElement(root, "fw_policy", name="Firewall-policy", db_key="",
                              file_filtering_policy_ref="Default File Filtering",
                              inspection_policy_ref="High-Security Inspection Template")

    # Create access_entry element
    access_entry = ET.SubElement(fw_policy, "access_entry")

    # Iterate through firewall rules and create rule_entry elements
    for priority, rule in enumerate(firewall_rules):
        rule_entry = ET.SubElement(access_entry, "rule_entry", db_key="",
                                   is_disabled=("true" if rule['Action'] == "Allow" else "false"),
                                   parent_rule_ref="Access rule : insert point", rank="{:.1f}".format(priority + 1),
                                   tag="0.0")

        access_rule = ET.SubElement(rule_entry, "access_rule")

        match_part = ET.SubElement(access_rule, "match_part")

        match_sources = ET.SubElement(match_part, "match_sources")
        match_source_ref = ET.SubElement(match_sources, "match_source_ref", type="network_element",
                                         value="network-" + rule['Source'])

        match_destinations = ET.SubElement(match_part, "match_destinations")
        match_destination_ref = ET.SubElement(match_destinations, "match_destination_ref", type="network_element",
                                              value="network-" + rule['Destination'])

        match_services = ET.SubElement(match_part, "match_services")
        for service in rule['Service']:
            match_service_ref = ET.SubElement(match_services, "match_service_ref", type="service", value=service)

        action = ET.SubElement(access_rule, "action", type=rule['Action'])

        option = ET.SubElement(access_rule, "option")

        log_policy = ET.SubElement(option, "log_policy", log_compression="off", log_level="stored", mss_enforce="false")

    # Create a new ElementTree and write to an XML file
    tree = ET.ElementTree(root)

    tree.write("output.xml", encoding='utf-8', xml_declaration=True)
    buffer = BytesIO()

    # Write the XML content to the buffer
    tree.write(buffer, encoding='utf-8', xml_declaration=True)

    # Get the content as bytes from the buffer
    xml_data = buffer.getvalue()

    # You may want to set appropriate headers for the response

    # Send the response with the XML content
    return xml_data


if __name__ == "__main__":
    firewall_rules = [
        {'Source': '10.178.0.0/16', 'Destination': '10.150.103.106', 'Service': ['UDP/902', 'HTTTP'], 'Port': '456',
         'Action': 'Allow'},
        {'Source': '10.178.0.0/16', 'Destination': '10.18.93.109', 'Service': ['DNS (UDP)'], 'Port': '456',
         'Action': 'Allow'},
        {'Source': '10.78.0.0/16', 'Destination': '10.18.93.110', 'Service': ['HTTP'], 'Port': '456',
         'Action': 'Allow'},
        {'Source': '10.78.41.214', 'Destination': '', 'Service': ['DNS (UDP)'], 'Port': '456', 'Action': 'Allow'}
    ]

    xml_data = generate_policy(firewall_rules)
    xml_string = xml_data.decode('utf-8')
    tree = ET.ElementTree(ET.fromstring(xml_string))
    output_file_path = 'output.xml'
    tree.write(output_file_path, encoding='utf-8', xml_declaration=True)
    print(f"XML content has been written to {output_file_path}")
