from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_admin_user
from app.services.claim_service import ClaimService
from app.schemas.claim import ClaimReview, ClaimOut
from app.schemas.item import ItemOut, ItemUpdate
from app.repositories.claim_repository import ClaimRepository
from app.repositories.item_repository import ItemRepository
from app.models.claim import ClaimStatus
from app.models.item import ItemStatus

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/items", response_model=list[ItemOut])
async def admin_list_items(
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user)
):
    items, _ = await ItemRepository(db).list_items(size=200)
    return items

@router.delete("/items/{item_id}", status_code=204)
async def delete_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user)
):
    repo = ItemRepository(db)
    item = await repo.get_by_id(item_id)
    if not item:
        raise HTTPException(404, "Not found")
    await repo.delete(item)

@router.patch("/items/{item_id}/close", response_model=ItemOut)
async def close_item(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user)
):
    repo = ItemRepository(db)
    item = await repo.get_by_id(item_id)
    if not item:
        raise HTTPException(404, "Not found")
    return await repo.update(item, ItemUpdate(status=ItemStatus.closed))

@router.get("/claims", response_model=list[ClaimOut])
async def admin_list_claims(
    status: ClaimStatus | None = None,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user)
):
    return await ClaimRepository(db).get_all(status=status)

@router.patch("/claims/{claim_id}/review", response_model=ClaimOut)
async def review_claim(
    claim_id: UUID,
    data: ClaimReview,
    db: AsyncSession = Depends(get_db),
    admin=Depends(get_admin_user)
):
    return await ClaimService(db).review_claim(claim_id, data, admin["user_id"])