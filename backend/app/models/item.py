import uuid
import enum
from sqlalchemy import Column, String, Text, Date, Enum, DateTime, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class ItemType(str, enum.Enum):
    lost = "lost"
    found = "found"

class ItemStatus(str, enum.Enum):
    open = "open"
    claimed = "claimed"
    closed = "closed"

class Item(Base):
    __tablename__ = "items"

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id      = Column(String(255), nullable=False, index=True)
    reporter_name    = Column(String(200), nullable=False)
    reporter_email   = Column(String(200), nullable=False)
    reporter_phone   = Column(String(20), nullable=False)
    title        = Column(String(200), nullable=False)
    description  = Column(Text, nullable=False)
    category     = Column(String(100), nullable=False, index=True)
    location     = Column(String(200), nullable=False, index=True)
    date         = Column(Date, nullable=False)
    type         = Column(Enum(ItemType,   name="item_type",   create_type=False), nullable=False, index=True)
    status       = Column(Enum(ItemStatus, name="item_status", create_type=False), nullable=False, default=ItemStatus.open, index=True)
    image_urls   = Column(Text)  # comma-separated URLs
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    claims = relationship("Claim", back_populates="item", cascade="all, delete-orphan")