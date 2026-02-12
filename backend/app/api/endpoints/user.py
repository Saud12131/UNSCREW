import email
from hmac import new
from os import name
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import AsyncSessionLocal
from app.models.UserModel import User
from app.utils.LoginSchema import Usercreate, UserLogin
from app.utils.auth import hash_password, verify_password, create_access_token

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

router = APIRouter(prefix="/auth",tags=["Auth"])

# routes here 
@router.post("/signup")
async def signup(user:Usercreate, db: AsyncSession = Depends(get_db)):

    result =  await db.execute(select(User).where(User.email==user.email))
    user_exits = result.scalars().first()
    if(user_exits):
        raise HTTPException(status_code=400,detail="User already exists")
    
    new_user = User(
        name= user.name,
        email= user.email,
        password= hash_password(user.password)
    )
    db.add(new_user)
    await db.commit()
    return {"message": "User created successfully"}


@router.post("/login")
async def login(user:UserLogin, db: AsyncSession = Depends(get_db)):
    result =  await db.execute(select(User).where(User.email==user.email))
    user_exits = result.scalars().first()
    if(not user_exits):
        raise HTTPException(status_code=400,detail="User does not exists")
    if not verify_password(user.password,user_exits.password):
        raise HTTPException(status_code=400,detail="Invalid password")
    token = create_access_token({"sub":str(user_exits.id)})
    return {"access_token":token,"token_type":"bearer"}
