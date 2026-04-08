from uuid import UUID
from fastapi import UploadFile, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.item_repository import ItemRepository
from app.schemas.item import ItemCreate, ItemUpdate
from app.services.upload_service import upload_images
from app.services.matching_service import MatchingService

class ItemService:
    def __init__(self, db: AsyncSession):
        self.repo = ItemRepository(db)
        self.matcher = MatchingService(db)

    async def report_item(self, data: ItemCreate, user_id: str, images: list[UploadFile]):
        image_urls = await upload_images(images) if images else ""
        item = await self.repo.create(data, user_id, image_urls)
        return item

    async def get_item(self, item_id: UUID):
        item = await self.repo.get_by_id(item_id)
        if not item:
            raise HTTPException(404, "Item not found")
        return item

    async def list_items(self, **kwargs):
        items, total = await self.repo.list_items(**kwargs)
        return items, total

    async def get_matches(self, item_id: UUID):
        item = await self.get_item(item_id)
        return await self.matcher.find_matches(item)

    async def update_item(self, item_id: UUID, data: ItemUpdate, user_id: str):
        item = await self.get_item(item_id)
        return await self.repo.update(item, data)