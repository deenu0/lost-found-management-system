from uuid import UUID
from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.dependencies import get_current_user
from app.services.claim_service import ClaimService
from app.schemas.claim import ClaimCreate, ClaimOut

router = APIRouter(prefix="/claims", tags=["claims"])

@router.post("/{item_id}", response_model=ClaimOut, status_code=201)
async def submit_claim(
    item_id:           UUID,
    proof_description: str        = Form(...),
    proof_image:       UploadFile = File(None),
    user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    data = ClaimCreate(proof_description=proof_description)
    return await ClaimService(db).submit_claim(item_id, user["user_id"], data, proof_image)

@router.get("/item/{item_id}", response_model=list[ClaimOut])
async def get_item_claims(
    item_id: UUID,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user)
):
    from app.repositories.claim_repository import ClaimRepository
    return await ClaimRepository(db).get_by_item(item_id)