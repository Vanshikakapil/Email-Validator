from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from db import get_db
from models import EmailRecord
from sqlalchemy import func, select, case

router = APIRouter()

@router.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)):
    total = await db.execute(select(func.count(EmailRecord.id)))
    valid = await db.execute(select(func.count()).where(EmailRecord.status == "valid"))
    invalid = await db.execute(select(func.count()).where(EmailRecord.status == "invalid"))
    latest = await db.execute(
        select(EmailRecord.created_at).order_by(EmailRecord.created_at.desc()).limit(1)
    )

    return {
        "total_uploads": total.scalar() or 0,
        "valid_emails": valid.scalar() or 0,
        "invalid_emails": invalid.scalar() or 0,
        "last_upload": str(latest.scalar() or "N/A"),
    }
@router.get("/emails")
async def get_emails(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmailRecord))
    records = result.scalars().all()
    return [r.to_dict() for r in records]