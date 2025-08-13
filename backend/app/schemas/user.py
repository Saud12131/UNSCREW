from pydantic import BaseModel, Field
from typing import Optional

class User(BaseModel):
    user_id: str
    name: str
    password: str
    
    class Config:
        from_attributes = True  # Allows conversion from MongoDB documents
        json_encoders = {
            # Add custom encoders if needed
        }
    