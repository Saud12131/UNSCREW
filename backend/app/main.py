from fastapi import FastAPI, Depends
from app.api.apiV1.api import api_router
from app.services.security import get_current_user
from app.models.UserModel import User
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="Unscrew backend",
    description="A backend for Unscrew, a ai agent that takes live interviews",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1", )

@app.get("/")
async def root():
    return {"message":"Welcome to Unscrew backend!"}

@app.get("/me")
async def read_user_me(current_user:User = Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email
    }