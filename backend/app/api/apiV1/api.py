from fastapi import APIRouter
from ..endpoints import user, agent

api_router = APIRouter()

api_router.include_router(user.router,prefix="/user",tags=["user"])
api_router.include_router(agent.router,prefix="/agent",tags=["ai-agent"])