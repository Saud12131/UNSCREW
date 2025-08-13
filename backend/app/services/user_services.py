import os
from openai import AzureOpenAI
from dotenv import load_dotenv
import azure.cognitiveservices.speech as speechsdk
from app.schemas.user import User
from app.db.mongodb import db
from fastapi import HTTPException
import uuid
load_dotenv()
# hash the password
async def signup(user_data: User):
    try:
        user_dict = {
            "user_id": str(uuid.uuid4()),  # Generate a unique ID
            "name": user_data.name,
            "password": user_data.password  # Note: In production, hash the password!
        }
        
        result = await db["users"].insert_one(user_dict)
        
        # Get the created user without the MongoDB _id
        created_user = await db["users"].find_one({"_id": result.inserted_id})
        if created_user:
            created_user["_id"] = str(created_user["_id"])  # Convert ObjectId to string
            return created_user
        else:
            raise HTTPException(status_code=404, detail="User not found after creation")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
async def get_allUsers():
    try:
        users = []
        all_users =  db["users"].find()
        return all_users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))