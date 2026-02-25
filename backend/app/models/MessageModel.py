import uuid
from sqlalchemy import Column, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship
class Message(Base):
    __tablename__= "interview_messages"
    id = Column(UUID(as_uuid=True),primary_key=True,default=uuid.uuid4)
    session_id = Column(UUID(as_uuid=True), ForeignKey("interview_sessions.id", ondelete="CASCADE"), nullable=False)
    sender = Column(String,nullable=False)
    content = Column(Text,nullable=False)
    created_at = Column(TIMESTAMP,server_default=func.now())

# Relationship 
    session = relationship("InterviewSession", back_populates="messages")