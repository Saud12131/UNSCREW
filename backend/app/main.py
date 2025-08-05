from fastapi import FastAPI
from app.api.apiV1.api import api_router
app = FastAPI(
    title="Unscrew backend",
    description="A backend for Unscrew, a ai agent that takes live interviews",
)

app.include_router(api_router, prefix="/api/v1", )

@app.get("/")
async def root():
    return {"message":"Welcome to Unscrew backend!"}