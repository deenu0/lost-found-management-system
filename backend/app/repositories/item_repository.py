from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.models.item import Item, ItemType, ItemStatus
from app.schemas.item import ItemCreate, ItemUpdate

class ItemRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: ItemCreate, user_id: str, image_urls: str) -> Item:
        item = Item(**data.model_dump(), user_id=user_id, image_urls=image_urls)
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def get_by_id(self, item_id: UUID) -> Item | None:
        result = await self.db.execute(select(Item).where(Item.id == item_id))
        return result.scalar_one_or_none()

    async def list_items(
        self,
        page: int = 1,
        size: int = 20,
        type: ItemType | None = None,
        status: ItemStatus | None = None,
        category: str | None = None,
        location: str | None = None,
    ) -> tuple[list[Item], int]:
        q = select(Item)
        if type:     q = q.where(Item.type == type)
        if status:   q = q.where(Item.status == status)
        if category: q = q.where(Item.category == category)
        if location: q = q.where(Item.location.ilike(f"%{location}%"))

        count_q = select(func.count()).select_from(q.subquery())
        total = (await self.db.execute(count_q)).scalar()

        q = q.order_by(Item.created_at.desc()).offset((page - 1) * size).limit(size)
        result = await self.db.execute(q)
        return result.scalars().all(), total

    async def update(self, item: Item, data: ItemUpdate) -> Item:
        for k, v in data.model_dump(exclude_none=True).items():
            setattr(item, k, v)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def delete(self, item: Item):
        await self.db.delete(item)
        await self.db.commit()