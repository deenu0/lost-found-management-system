from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.claim import Claim, ClaimStatus
from app.schemas.claim import ClaimCreate, ClaimReview

class ClaimRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, item_id: UUID, user_id: str, data: ClaimCreate, image_url: str | None) -> Claim:
        claim = Claim(
            item_id=item_id,
            claimant_user_id=user_id,
            proof_description=data.proof_description,
            proof_image_url=image_url,
        )
        self.db.add(claim)
        await self.db.commit()
        await self.db.refresh(claim)
        return claim

    async def get_by_id(self, claim_id: UUID) -> Claim | None:
        result = await self.db.execute(select(Claim).where(Claim.id == claim_id))
        return result.scalar_one_or_none()

    async def get_by_item(self, item_id: UUID) -> list[Claim]:
        result = await self.db.execute(select(Claim).where(Claim.item_id == item_id))
        return result.scalars().all()

    async def get_all(self, status: ClaimStatus | None = None) -> list[Claim]:
        q = select(Claim)
        if status: q = q.where(Claim.status == status)
        result = await self.db.execute(q.order_by(Claim.created_at.desc()))
        return result.scalars().all()

    async def review(self, claim: Claim, data: ClaimReview) -> Claim:
        claim.status = data.status
        claim.admin_note = data.admin_note
        await self.db.commit()
        await self.db.refresh(claim)
        return claim

    async def user_already_claimed(self, item_id: UUID, user_id: str) -> bool:
        result = await self.db.execute(
            select(Claim).where(
                Claim.item_id == item_id,
                Claim.claimant_user_id == user_id
            )
        )
        return result.scalar_one_or_none() is not None