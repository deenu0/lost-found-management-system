from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends, File, Form, UploadFile, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user
from app.services.item_service import ItemService
from app.schemas.item import ItemOut, ItemListOut, ItemUpdate, ItemCreate
from app.models.item import ItemType, ItemStatus
from datetime import date as date_type

router = APIRouter(prefix="/items", tags=["items"])

@router.post("/", response_model=ItemOut, status_code=201)
async def report_item(
    reporter_name:  str       = Form(...),
    reporter_email: str       = Form(...),
    reporter_phone: str       = Form(...),
    title:          str       = Form(...),
    description:    str       = Form(...),
    category:       str       = Form(...),
    location:       str       = Form(...),
    date:           str       = Form(...),
    type:           ItemType  = Form(...),
    images:         List[UploadFile] = File(default=[]),
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if len(images) > 5:
        from fastapi import HTTPException
        raise HTTPException(400, "Maximum 5 images allowed")
    data = ItemCreate(
        reporter_name=reporter_name,
        reporter_email=reporter_email,
        reporter_phone=reporter_phone,
        title=title, description=description,
        category=category, location=location,
        date=date_type.fromisoformat(date), type=type
    )
    return await ItemService(db).report_item(data, user["user_id"], images)

@router.get("/", response_model=ItemListOut)
async def list_items(
    page:     int               = Query(1, ge=1),
    size:     int               = Query(20, ge=1, le=100),
    type:     ItemType | None   = None,
    status:   ItemStatus | None = None,
    category: str | None        = None,
    location: str | None        = None,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ItemService(db)
    items, total = await svc.list_items(
        page=page, size=size, type=type,
        status=status, category=category, location=location
    )
    return ItemListOut(items=items, total=total, page=page, size=size)

@router.get("/{item_id}", response_model=ItemOut)
async def get_item(item_id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await ItemService(db).get_item(item_id)

@router.get("/{item_id}/matches", response_model=list[ItemOut])
async def get_matches(item_id: UUID, db: AsyncSession = Depends(get_db), _=Depends(get_current_user)):
    return await ItemService(db).get_matches(item_id)

@router.patch("/{item_id}", response_model=ItemOut)
async def update_item(item_id: UUID, data: ItemUpdate, user=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await ItemService(db).update_item(item_id, data, user["user_id"])