## Introduction
This document details the overall structure of the backend and the technologies used. It also gives more details on how to add different models and rule generators.

## Structure and technologies used
The backend uses [FastAPI](https://fastapi.tiangolo.com/) as a framework for exposing an API to the user. The API gives the user the ability to interact with the many functionalities of the backend. The current endpoints are as follows:
- POST **/upload/traffic/forcepoint/**: sending a JSON traffic file to this URI gives the user a response which contains a list of rules that allow only that traffic to pass.
- POST **/upload/rules/forcepoint/{rule_name}**: sending a list of rules (in the format specified previously) to this endpoint gives the user a XML file which they can then import into the Forcepoint SMC.

In order to assure modularity and extensibility, the backend is organized into modules. The primary modules are the models used for representing rule and traffic files, as well as the firewall rules generators.

## Traffic and Rule models
In order to model the structure of network traffic and firewall rules, we use [Pydantic](https://docs.pydantic.dev/latest/). Each Pydantic model that represents a vendor-specific traffic or rule file structure inherits from the corresponding parent class with predefined attributes; each vendor-specific model then tries to map the attributes from the proprietary structure into the general class attributes, which makes it possible to create logic that deals with traffic (or rule) files regardless of the vendor and the structure of their files.

The base class for the traffic files can be found here: https://github.com/yelhamer/Forcepoint-PolicyBot/blob/main/policybot/models/traffic/base_traffic.py
The base class for the rules files can be found here: https://github.com/yelhamer/Forcepoint-PolicyBot/blob/main/policybot/models/rules/base_rule.py

When writing logic that deals with traffic or rule files, it is sufficient to use just these attributes regardless of the vendor; identification of the structure and vendor is done through Pydantic and the URI that the user provides.

## Adding a new traffic or rules model
If you want to add support for a new vendor, you can write a Pydantic model that inherits from the aforementioned base classes and then use that model whenever needed. Please remember to implement a method (_to_XML()_) that generates XML from the rules file in case your vendor uses XML and you want to support automatic generation of it.

For reference, you can check the Pydantic models for Forcepoint:
- Traffic model: https://github.com/yelhamer/Forcepoint-PolicyBot/blob/main/policybot/models/traffic/forcepoint.py
- Rules model: https://github.com/yelhamer/Forcepoint-PolicyBot/blob/main/policybot/models/rules/forcepoint.py

## Rule generation
Writing a rules generator is simple granted that you have the algorithm or heuristic planned out. All you need to do is to inherit from the base class defined in [policybot/generators/base_generator.py](https://github.com/yelhamer/Forcepoint-PolicyBot/blob/main/policybot/generators/base_generator.py), and then implement the _generate_rules()_ method.

In most cases, you want the aforementioned method to take in the parent traffic class mentioned above and then write your logic with regards to the attributes defined in it; this assures the portability of your rule generation logic.

## Shipping changes
Once your custom Pydantic models and rule generation logic is all set to go, you need to modify the API [main.py](https://github.com/yelhamer/Forcepoint-PolicyBot/blob/main/policybot/main.py) file and add the corresponding endpoints for your new models and rule generation. 

## Questions and Contributions
If you have any questions or you would like to make a contribution, then please feel free to open an Issue or a Pull Request!
