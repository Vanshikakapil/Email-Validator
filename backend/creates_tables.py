import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from models import Base  # adjust if Base is from somewhere else
from database import DATABASE_URL  # make sure this is defined

engine = create_async_engine(DATABASE_URL, echo=True)

async def create_all():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(create_all())
