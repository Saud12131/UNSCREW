import uuid
from sqlalchemy import Column, String, TIMESTAMP, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.database import Base
from sqlalchemy.orm import relationship
class InterviewSession(Base):
    __tablename__ = "interview_sessions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    messages = relationship(
        "Message",
        back_populates="session",
        cascade="all, delete-orphan"
    )
    role_applied = Column(String, nullable=False)
    status = Column(String, default="active")
    started_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    ended_at = Column(TIMESTAMP, nullable=True)