# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from config import DATABASE_URL  # ✅ Always import from config.py

# Create async engine using the DATABASE_URL from .env
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Create a session factory
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base model for all tables
Base = declarative_base()

# Dependency for DB sessions
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
