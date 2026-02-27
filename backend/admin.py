from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from db import async_session
from models import EmailRecord, User, PendingUser, Log

router = APIRouter()

# 📊 Admin Analytics (Live from DB)
@router.get("/admin/analytics")
async def get_analytics(session: AsyncSession = Depends(async_session)):
    today = datetime.utcnow().date()
    result = await session.execute(select(EmailRecord))
    records = result.scalars().all()

    valid_today = sum(1 for r in records if r.status == "Valid" and r.timestamp.date() == today)
    invalid_today = sum(1 for r in records if r.status == "Invalid" and r.timestamp.date() == today)

    gmail = sum(1 for r in records if r.email.endswith("@gmail.com"))
    yahoo = sum(1 for r in records if r.email.endswith("@yahoo.com"))
    others = len(records) - gmail - yahoo

    return {
        "today": {"valid": valid_today, "invalid": invalid_today},
        "week": {"total": len(records), "bounce_rate": round((invalid_today / max(1, len(records))) * 100, 2)},
        "domain": {
            "gmail": gmail,
            "yahoo": yahoo,
            "others": others
        }
    }

# 🧾 Admin Logs (Live from DB)
@router.get("/admin/logs")
async def get_logs(session: AsyncSession = Depends(async_session)):
    result = await session.execute(select(Log).order_by(Log.timestamp.desc()))
    logs = result.scalars().all()
    return [ 
        {
            "id": log.id,
            "admin_email": log.admin_email,
            "action": log.action,
            "timestamp": log.timestamp.isoformat()
        }
        for log in logs
    ]

# 👥 Pending User Requests
@router.get("/admin/pending-users")
async def get_pending_users(session: AsyncSession = Depends(async_session)):
    result = await session.execute(select(PendingUser))
    pending = result.scalars().all()
    return [
        {
            "email": user.email,
            "requested_at": user.created_at.isoformat()
        }
        for user in pending
    ]

# ✅ Approve a Pending User
@router.post("/admin/approve-user")
async def approve_user(email: str, session: AsyncSession = Depends(async_session)):
    # Fetch pending user
    result = await session.execute(select(PendingUser).where(PendingUser.email == email))
    pending_user = result.scalar_one_or_none()

    if not pending_user:
        raise HTTPException(status_code=404, detail="Pending user not found")

    # Move to User table
    new_user = User(email=email, hashed_password=pending_user.hashed_password, role="user", blocked=False)
    session.add(new_user)
    await session.delete(pending_user)

    # Add to logs
    log = Log(admin_email="vanshikakapil37@gmail.com", action=f"Approved user {email}")
    session.add(log)

    await session.commit()
    return {"message": f"User {email} approved"}

# 🔒 Block a User
@router.put("/admin/block-user")
async def block_user(email: str, session: AsyncSession = Depends(async_session)):
    result = await session.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.blocked = True
    session.add(Log(admin_email="vanshikakapil37@gmail.com", action=f"Blocked user {email}"))

    await session.commit()
    return {"message": f"User {email} has been blocked"}
