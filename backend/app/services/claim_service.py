from uuid import UUID
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.claim_repository import ClaimRepository
from app.repositories.item_repository import ItemRepository
from app.schemas.claim import ClaimCreate, ClaimReview
from app.schemas.item import ItemUpdate
from app.services.upload_service import upload_image
from app.models.item import ItemStatus
from app.models.claim import ClaimStatus
from app.services.notification_service import notify_claim_submitted, notify_claim_approved
import logging

logger = logging.getLogger(__name__)

class ClaimService:
    def __init__(self, db: AsyncSession):
        self.claim_repo = ClaimRepository(db)
        self.item_repo  = ItemRepository(db)

    async def submit_claim(self, item_id: UUID, user_id: str, data: ClaimCreate, image: UploadFile | None):
        item = await self.item_repo.get_by_id(item_id)
        if not item:
            raise HTTPException(404, "Item not found")
        if item.status != ItemStatus.open:
            raise HTTPException(400, "Item is not open for claims")
        if await self.claim_repo.user_already_claimed(item_id, user_id):
            raise HTTPException(409, "Already submitted a claim for this item")

        image_url = await upload_image(image, folder="claims")
        claim = await self.claim_repo.create(item_id, user_id, data, image_url)
        await self.item_repo.update(item, ItemUpdate(status=ItemStatus.claimed))

        # Send notification email to reporter
        if item.reporter_email:
            try:
                notify_claim_submitted(
                    item_title=item.title,
                    reporter_email=item.reporter_email,
                    reporter_name=item.reporter_name or "Reporter",
                    reporter_phone=item.reporter_phone or "N/A"
                )
            except Exception as e:
                logger.error(f"Notification failed: {e}")

        return claim

    async def review_claim(self, claim_id: UUID, data: ClaimReview, admin_user_id: str):
        claim = await self.claim_repo.get_by_id(claim_id)
        if not claim:
            raise HTTPException(404, "Claim not found")
        reviewed = await self.claim_repo.review(claim, data)
        item = await self.item_repo.get_by_id(claim.item_id)
        new_status = ItemStatus.closed if data.status == ClaimStatus.approved else ItemStatus.open
        await self.item_repo.update(item, ItemUpdate(status=new_status))

        # Notify reporter if claim approved
        if data.status == ClaimStatus.approved and item.reporter_email:
            try:
                notify_claim_approved(
                    item_title=item.title,
                    reporter_email=item.reporter_email,
                    reporter_name=item.reporter_name or "Reporter",
                    reporter_phone=item.reporter_phone or "N/A"
                )
            except Exception as e:
                logger.error(f"Approval notification failed: {e}")

        return reviewed