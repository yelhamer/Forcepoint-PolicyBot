from fastapi import FastAPI, File, UploadFile
from models.traffic.forcepoint import ForcePointTrafficLog
from fastapi.responses import Response
from generators.forcepoint import ForcepointGenerator
from models.rules.forcepoint import ForcePointRuleSet
import uvicorn

app = FastAPI()

@app.post("/upload/traffic/forcepoint/", response_model=ForcePointRuleSet, response_model_by_alias=True)
async def parse_forcepoint_log_file(trafficLog: ForcePointTrafficLog):
    print(len(trafficLog.root))
    generator = ForcepointGenerator(traffic=trafficLog)
    return generator.generate_rules()

@app.post("/upload/rules/forcepoint/{rule_name}")
async def generate_xml_rule_file(rule_name: str, rules: ForcePointRuleSet):
    return Response(content=rules.to_xml(rule_name), media_type="application/xml")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
