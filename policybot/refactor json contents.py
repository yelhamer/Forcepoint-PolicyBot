import json

def transform_log_entry(log_entry):
    # Extracting relevant information
    src_ip = log_entry['Src']
    dst_ip = log_entry['Dst']
    service = log_entry['Service']
    port = log_entry['Dport']
    action = log_entry['Action']

    # Modifying the information based on the specified structure
    transformed_entry = {
        'Source': src_ip,
        'Destination': dst_ip,
        'Service': service,
        'Port': port,
        'Action': action
    }

    return transformed_entry

def modify_json_file(input_file_path, output_file_path):
    with open(input_file_path, 'r') as input_file:
        # Load the JSON data from the input file
        input_data = json.load(input_file)

        # Transform each log entry and create a list of modified entries
        modified_entries = [transform_log_entry(entry) for entry in input_data]

    with open(output_file_path, 'w') as output_file:
        # Write the modified entries to the output file
        json.dump(modified_entries, output_file, indent=2)


modify_json_file('original.json', 'modified.json')
