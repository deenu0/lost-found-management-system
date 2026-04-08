from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.config import settings
import os

# Use SSL for cloud databases (Supabase requires it)
connect_args = {}
if "supabase" in settings.DATABASE_URL or os.getenv("USE_SSL", "false").lower() == "true":
    connect_args = {"ssl": "require"}

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=connect_args,
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session