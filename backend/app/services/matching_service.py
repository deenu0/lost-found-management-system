from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.models.item import Item, ItemType, ItemStatus

class MatchingService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def find_matches(self, item: Item, limit: int = 5) -> list[Item]:
        opposite = ItemType.found if item.type == ItemType.lost else ItemType.lost
        q = (
            select(Item)
            .where(
                Item.id != item.id,
                Item.type == opposite,
                Item.status == ItemStatus.open,
                or_(
                    Item.category == item.category,
                    Item.location.ilike(f"%{item.location.split()[0]}%"),
                ),
            )
            .limit(limit)
        )
        result = await self.db.execute(q)
        return result.scalars().all()