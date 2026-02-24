
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.models.InterviewSession import InterviewSession
from app.models import UserModel
from app.services.security import get_current_user

router = APIRouter(prefix="/interview", tags=["interview"])

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

@router.post("/start")
async def create_interview_session(
role_applied:str,
current_user: UserModel = Depends(get_current_user),
db:AsyncSession = Depends(get_db)
):
    interview_session = InterviewSession(
        user_id=current_user.id,
        role_applied=role_applied
    )
    db.add(interview_session)
    await db.commit()
    await db.refresh(interview_session)
    return {
        "message": "Interview session created successfully",
        "session_id": str(interview_session.id),
        "status": interview_session.status,
    }

    
    