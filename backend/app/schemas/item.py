from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime
from uuid import UUID
from typing import Optional, List
from app.models.item import ItemType, ItemStatus

class ItemCreate(BaseModel):
    reporter_name:  str = Field(..., min_length=2, max_length=200)
    reporter_email: str = Field(..., min_length=5)
    reporter_phone: str = Field(..., min_length=7, max_length=20)
    title:          str = Field(..., min_length=3, max_length=200)
    description:    str = Field(..., min_length=10)
    category:       str
    location:       str
    date:           date
    type:           ItemType

class ItemUpdate(BaseModel):
    title:       Optional[str]        = None
    description: Optional[str]        = None
    category:    Optional[str]        = None
    location:    Optional[str]        = None
    status:      Optional[ItemStatus] = None

class ItemOut(BaseModel):
    id:             UUID
    user_id:        str
    reporter_name:  Optional[str] = None
    reporter_email: Optional[str] = None
    reporter_phone: Optional[str] = None
    title:          str
    description:    str
    category:       str
    location:       str
    date:           date
    type:           ItemType
    status:         ItemStatus
    image_urls:     Optional[str] = None
    created_at:     datetime
    updated_at:     datetime

    model_config = {"from_attributes": True}

class ItemListOut(BaseModel):
    items: list[ItemOut]
    total: int
    page:  int
    size:  int