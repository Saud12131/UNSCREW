from fastapi import APIRouter,HTTPException

router = APIRouter()

@router.get("/{user_id}")
async def user_test(user_id:str):
    return {"user_id": user_id}