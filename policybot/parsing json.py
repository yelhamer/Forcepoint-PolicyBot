import json

with open('sample1.json', 'r') as json_file:
    file_contents = json.load(json_file)



#print(file_contents)

source_ip = []
destination_ip = []
protocol = []
service = []
action = []

for item in file_contents:
    destination_ip.append(item['Dst'])

for item in file_contents:
    protocol.append(item['Protocol'])

for item in file_contents:
    service.append(item['Service'])

for item in file_contents:
    action.append(item['Action'])

for item in file_contents:
    source_ip.append(item['Src'])

print(service)