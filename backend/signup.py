from fastapi import APIRouter, HTTPException, Depends
from db import get_db  # SQLAlchemy session
from models import User  # SQLAlchemy ORM model
from schema import UserCreate  # Pydantic schema
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"

@router.post("/signup")
async def signup(user: UserSignup, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,  # ✅ updated
        role=user.role,
        status="pending",
        blocked=False 
    )

    db.add(new_user)
    await db.commit()
    return {"message": "Signup successful. Awaiting admin approval."}
