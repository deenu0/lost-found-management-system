import uuid
import enum
from sqlalchemy import Column, String, Text, Enum, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class ClaimStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"

class Claim(Base):
    __tablename__ = "claims"
    __table_args__ = (UniqueConstraint("item_id", "claimant_user_id"),)

    id                = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    item_id           = Column(UUID(as_uuid=True), ForeignKey("items.id", ondelete="CASCADE"), nullable=False)
    claimant_user_id  = Column(String(255), nullable=False, index=True)
    proof_description = Column(Text, nullable=False)
    proof_image_url   = Column(Text)
    status = Column(Enum(ClaimStatus, name="claim_status", create_type=False), nullable=False, default=ClaimStatus.pending, index=True)
    admin_note        = Column(Text)
    created_at        = Column(DateTime(timezone=True), server_default=func.now())
    updated_at        = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    item = relationship("Item", back_populates="claims")