from fastapi import APIRouter,HTTPException
from app.schemas.user import User
from app.services.user_services import signup

router = APIRouter()

@router.post("/signup")
async def user_test(user_data: User):
    try:
        new_user = await signup(user_data)
        return new_user
    except Exception as e:
        return HTTPException(status_code=500, detail=str(e))

@router.get("/all")
async def get_all_users():
    try:
        users = await get_all_users()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))