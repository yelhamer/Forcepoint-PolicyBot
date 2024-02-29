from fastapi import FastAPI, File, UploadFile
from fastapi.openapi.models import Response
from fastapi.responses import JSONResponse
import json
from fastapi import APIRouter

from generators.service.policy_generator import generate_policy

router = APIRouter()


@router.post("/generator/")
async def create_upload_file(rules):
    try:
        xml_data = generate_policy(rules)
        headers = {
            'Content-Type': 'application/xml',
            'Content-Disposition': 'attachment; filename=output.xml'
        }

        return Response(xml_data, headers=headers)
    except Exception as e:
        return JSONResponse(content={"detail": f"Error processing the rules: {str(e)}"}, status_code=400)
