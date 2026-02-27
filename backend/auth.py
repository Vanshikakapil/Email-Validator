from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from models import User as DBUser, EmailRecord  # ✅ Avoid conflict with Pydantic model
from db import get_db
from passlib.hash import bcrypt
from sqlalchemy.future import select
from typing import Literal
import os, json

router = APIRouter()

# JSON path for admin credentials
USERS_FILE = os.path.join(os.path.dirname(__file__), "users.json")

# ----- Pydantic Schemas -----
class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: Literal["admin", "user"]

class LoginData(BaseModel):
    email: str
    password: str

# ----- Load admin credentials from JSON -----
def load_admins():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

# ----- USER SIGNUP (Database) -----
@router.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):
    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Admin signup not allowed")

    existing = db.query(DBUser).filter(DBUser.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pwd = bcrypt.hash(user.password)
    new_user = DBUser(
        name=user.name,
        email=user.email,
        password=hashed_pwd,
        is_admin=False,
        is_approved=False,
        allowed_credits=20
    )
    db.add(new_user)
    db.commit()
    return {"message": "Signup successful. Awaiting admin approval."}







