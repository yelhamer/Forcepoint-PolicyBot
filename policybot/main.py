from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import json
import uvicorn

app = FastAPI()

app.add_middleware(CORSMiddleware, allow_origins=['http://localhost:3000'])


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/uploadJson/")
async def create_upload_file(file: UploadFile):
    try:
        content = await file.read()
        data = json.loads(content)
        if isinstance(data, list):
            return JSONResponse(content=data, status_code=200)
        else:
            return JSONResponse(content={"detail": "Invalid JSON format. Expected a list."}, status_code=400)
    except json.JSONDecodeError as e:
        return JSONResponse(content={"detail": f"Error decoding JSON: {str(e)}"}, status_code=400)


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
