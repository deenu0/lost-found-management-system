from pydantic import BaseModel, Field
from datetime import datetime
from uuid import UUID
from typing import Optional
from app.models.claim import ClaimStatus

class ClaimCreate(BaseModel):
    proof_description: str = Field(..., min_length=20)

class ClaimReview(BaseModel):
    status:     ClaimStatus
    admin_note: Optional[str] = None

class ClaimOut(BaseModel):
    id:                UUID
    item_id:           UUID
    claimant_user_id:  str
    proof_description: str
    proof_image_url:   Optional[str] = None
    status:            ClaimStatus
    admin_note:        Optional[str] = None
    created_at:        datetime

    model_config = {"from_attributes": True}