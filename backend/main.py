from fastapi import FastAPI, UploadFile, File, Form, APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import csv, os, time, json, socket, smtplib, dns.resolver
from typing import List, Dict, Optional
from concurrent.futures import ThreadPoolExecutor, as_completed
from sqlalchemy.ext.asyncio import AsyncSession
from database import engine
from sqlalchemy.future import select
from models import EmailRecord, Base
from validator.regex_check import is_valid_regex
from db import init_models, get_db, SessionLocal
from config import DATABASE_URL
from contextlib import asynccontextmanager
from uuid import uuid4
from sqlalchemy import func, case, text
import bcrypt
from models import User
from passlib.context import CryptContext
from signup import router as signup_router
from jose import jwt
from db import get_db
from datetime import datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from config import DATABASE_URL
from collections import defaultdict
import time
print("💡 Using DATABASE_URL:", DATABASE_URL)

router = APIRouter()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 👉 Startup logic
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Tables synced with database.")
    yield
    print("🔻 Shutting down app.")
app = FastAPI(lifespan=lifespan)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Constants
SOCKET_TIMEOUT = 6
THREAD_POOL_SIZE = 50
BATCH_SIZE = 500


@app.get("/")
def read_root():
    return {"message": "Email Validator Backend is running"}

# ======================= Email Validation Core =======================

def has_mx_record(domain: str, timeout: int = SOCKET_TIMEOUT) -> str:
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = timeout
        resolver.lifetime = timeout
        answers = resolver.resolve(domain, 'MX')
        return str(answers[0].exchange).rstrip('.') if answers else None
    except Exception:
        return None

def verify_smtp(email: str, mx_host: str, timeout: int = SOCKET_TIMEOUT) -> bool:
    try:
        socket.setdefaulttimeout(timeout)
        with smtplib.SMTP(mx_host, 25, timeout=timeout) as server:
            server.helo("example.com")
            server.mail("test@example.com")
            code, _ = server.rcpt(email)
            return code == 250 or code == 251
    except Exception:
        return False

def validate_email_detailed(email: str) -> Dict[str, str]:
    email = email.strip()
    result = {"email": email}

    if not is_valid_regex(email):
        result.update({
            "regex": "invalid", "mx": "-", "smtp": "-", "status": "Invalid"
        })
        return result

    result["regex"] = "valid"
    domain = email.split('@')[-1]
    mx_host = has_mx_record(domain)
    if not mx_host:
        result.update({
            "mx": "invalid", "smtp": "-", "status": "Invalid"
        })
        return result

    result["mx"] = "valid"
    smtp_valid = verify_smtp(email, mx_host)
    result["smtp"] = "valid" if smtp_valid else "invalid"
    result["status"] = "Valid" if smtp_valid else "Invalid"
    return result

def process_emails_in_batches(emails: List[str]):
    results, failed_emails = [], []
    total = len(emails)
    valid = invalid = 0

    for i in range(0, total, BATCH_SIZE):
        batch = emails[i:i + BATCH_SIZE]
        with ThreadPoolExecutor(max_workers=THREAD_POOL_SIZE) as executor:
            future_to_email = {executor.submit(validate_email_detailed, email): email for email in batch}
            for future in as_completed(future_to_email):
                try:
                    result = future.result()
                    results.append(result)
                    if result.get("status") == "Valid":
                        valid += 1
                    else:
                        invalid += 1
                        failed_emails.append(result["email"])
                except Exception:
                    invalid += 1
    return results, total, valid, invalid, failed_emails

# ======================= Models =======================

class LoginData(BaseModel):
    email: str
    password: str

class SingleEmailInput(BaseModel):
    email: str

# ======================= Auth (Hashed Password) =======================



def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))



# ======================= Routes =======================

SECRET_KEY = "aisha-negi"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
def create_token(user_id: int):
    payload = {
        "sub": str(user_id),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


# login for user 
@app.post("/login")
async def login(data: LoginData, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not bcrypt.checkpw(data.password.encode(), user.hashed_password.encode()):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if user.status != "active":
        raise HTTPException(status_code=403, detail="Account is not activated.")
    if user.blocked:
        raise HTTPException(status_code=403, detail="Account is blocked.")

    token = create_token(user.id)

    return {
        "message": "Login successful",
        "id": user.id,             # ✅ Add this
        "email": user.email,
        "role": user.role,         # ✅ Add this
        "token": token
    }

#  curent user 
async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        # user_id: int = payload.get("user_id")
        user_id: int = int(payload.get("sub"))
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Token decode error")



# user records 
@app.get("/user/records")
async def get_user_records(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        result = await db.execute(
            select(EmailRecord).where(EmailRecord.user_id == current_user.id)
        )
        records = result.scalars().all()
        return [record.to_dict() for record in records]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# user all data 

@app.get("/user/all-emails")
async def get_all_emails_for_user(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(EmailRecord).where(EmailRecord.user_id == current_user.id)
    )
    records = result.scalars().all()
    return [r.to_dict() for r in records]


# validate emails 
@app.post("/validate-emails/")
async def validate_emails(
    files: List[UploadFile] = File([]),
    email: Optional[str] = Form(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    start_time = time.time()
    response_payload = []

    try:
        # === Single Email Validation ===
        if email:
            results, total, valid, invalid, _ = process_emails_in_batches([email])
            
            for result in results:
                db.add(EmailRecord(
                    email=result["email"],
                    regex=result["regex"],
                    mx=result["mx"],
                    smtp=result["smtp"],
                    status=result["status"],
                    created_at=datetime.utcnow(),
                    user_id=current_user.id
                ))
            await db.commit()

            return {
                "email": results[0]["email"],
                "is_valid": results[0]["status"] == "Valid",
                "regex": results[0]["regex"],
                "mx": results[0]["mx"],
                "smtp": results[0]["smtp"],
                "reason": results[0]["status"],
                "execution_time": round(time.time() - start_time, 2),
            }

        # === File Upload Validation ===
        if files:
            for file in files:
                contents = await file.read()
                lines = contents.decode().splitlines()

                try:
                    reader = csv.DictReader(lines)
                    emails = [row.get('email', '').strip() for row in reader if row.get('email')]
                except Exception:
                    emails = [line.strip() for line in lines if line.strip()]

                results, total, valid, invalid, failed_emails = process_emails_in_batches(emails)

                # ✅ Save all results with user_id
                for result in results:
                    db.add(EmailRecord(
                        email=result["email"],
                        regex=result["regex"],
                        mx=result["mx"],
                        smtp=result["smtp"],
                        status=result["status"],
                        created_at=datetime.utcnow(),
                        user_id=current_user.id   # <-- FIX ADDED
                    ))
                await db.commit()

                # Generate unique download files
                unique_id = uuid4().hex
                validated_filename = f"validated_{unique_id}_{file.filename}"
                failed_filename = f"failed_{unique_id}_{file.filename}"

                validated_rows = [r for r in results if r["status"] == "Valid"]
                failed_rows = [r for r in results if r["status"] != "Valid"]

                with open(validated_filename, 'w', newline='') as f:
                    writer = csv.DictWriter(f, fieldnames=['email', 'regex', 'mx', 'smtp', 'status'])
                    writer.writeheader()
                    writer.writerows(validated_rows)

                if failed_rows:
                    with open(failed_filename, 'w', newline='') as f:
                        writer = csv.DictWriter(f, fieldnames=['email', 'regex', 'mx', 'smtp', 'status'])
                        writer.writeheader()
                        writer.writerows(failed_rows)

                response_payload.append({
                    "file": file.filename,
                    "total": total,
                    "valid": valid,
                    "invalid": invalid,
                    "execution_time": round(time.time() - start_time, 2),
                    "validated_download": f"/download/{validated_filename}",
                    "failed_download": f"/download/{failed_filename}" if failed_rows else None
                })

        if not email and not files:
            raise HTTPException(status_code=400, detail="Either 'email' or 'files' must be provided.")

        return {
            "message": "Validation completed",
            "time_taken_seconds": round(time.time() - start_time, 2),
            "results": response_payload
        }

    except Exception as e:
        await db.rollback()
        print("❌ Validation Error:", e)
        raise HTTPException(status_code=500, detail=f"Validation failed: {str(e)}")

@app.post("/validate-single-email/")
async def validate_single_email_route(
    email: str = Form(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)  # ✅ get current user
):
    start_time = time.time()
    results, total, valid, invalid, _ = process_emails_in_batches([email])
    execution_time = round(time.time() - start_time, 2)

    for result in results:
        db.add(EmailRecord(
            email=result["email"],
            regex=result["regex"],
            mx=result["mx"],
            smtp=result["smtp"],
            status=result["status"],
            created_at=datetime.utcnow(),
            user_id=user.id  
        ))
    await db.commit()

    return {
        "email": results[0]["email"],
        "is_valid": results[0]["status"] == "Valid",
        "regex": results[0]["regex"],
        "mx": results[0]["mx"],
        "smtp": results[0]["smtp"],
        "status": results[0]["status"],
        "time_taken": execution_time
    }
# download

@app.get("/download/{filename}")
def download_file(filename: str):
    file_path = os.path.join(".", filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, media_type='text/csv', filename=filename)
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/admin/recent-results")
async def get_recent_results(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(EmailRecord).order_by(EmailRecord.created_at.desc()).limit(5000)
    )
    records = result.scalars().all()
    return [r.to_dict() for r in records]

@app.get("/summary")
async def get_summary(db: AsyncSession = Depends(get_db)):
    total = await db.scalar(select(func.count()).select_from(EmailRecord))
    valid = await db.scalar(select(func.count()).select_from(EmailRecord).where(EmailRecord.status == "Valid"))
    invalid = total - valid
    last_upload = await db.scalar(select(EmailRecord.created_at).order_by(EmailRecord.created_at.desc()).limit(1))

    return {
        "total_uploads": total,
        "valid_emails": valid,
        "invalid_emails": invalid,
        "last_upload": last_upload.isoformat() if last_upload else None,
    }

@app.get("/admin/email-stats")
async def get_email_stats(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(func.date(EmailRecord.created_at).label("date"),
               func.count().label("total"),
               func.sum(case((EmailRecord.status == "Valid", 1), else_=0)).label("valid"),
               func.sum(case((EmailRecord.status != "Valid", 1), else_=0)).label("invalid"))
        .group_by(func.date(EmailRecord.created_at))
        .order_by(func.date(EmailRecord.created_at))
    )
    rows = result.all()

    total_count = await db.scalar(select(func.count()).select_from(EmailRecord))
    valid_count = await db.scalar(select(func.count()).select_from(EmailRecord).where(EmailRecord.status == "Valid"))
    invalid_count = total_count - valid_count

    regex_acc = await db.scalar(
        select(func.avg(case((EmailRecord.regex == "valid", 100), else_=0)))
    )
    mx_acc = await db.scalar(
        select(func.avg(case((EmailRecord.mx == "valid", 100), else_=0)))
    )
    smtp_acc = await db.scalar(
        select(func.avg(case((EmailRecord.smtp == "valid", 100), else_=0)))
    )

    return {
        "trend": [{"date": str(r.date), "valid": r.valid, "invalid": r.invalid} for r in rows],
        "counts": {
            "total": total_count,
            "valid": valid_count,
            "invalid": invalid_count,
            "regex_accuracy": round(regex_acc or 0, 2),
            "mx_accuracy": round(mx_acc or 0, 2),
            "smtp_accuracy": round(smtp_acc or 0, 2),
        }
    }



@app.get("/emails")
async def get_emails(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(EmailRecord))
    records = result.scalars().all()
    return [r.to_dict() for r in records]


# Fetch all users
@router.post("/admin/login")
async def admin_login(data: LoginData, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == data.email))
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect password")

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    
    return {
        "email": user.email
    }


# Block/unblock user
class BlockData(BaseModel):
    id: int
    blocked: bool

@router.post("/block-user")
async def block_user(data: BlockData, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == data.id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.blocked = data.blocked
    db.add(user)
    await db.commit()

    return {"message": "User block status updated successfully"}

# Delete user
@router.delete("/delete-user/{user_id}")
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"message": "User deleted successfully"}


# Update user details
class UserUpdate(BaseModel):
    id: int
    email: str
    role: str
    status: str


@router.put("/update-user")
async def update_user(data: UserUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == data.id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.email = data.email
    user.role = data.role
    user.status = data.status
    await db.commit()
    return {"message": "User updated successfully"}

@router.get("/users")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users


# fetch all data 
# fetch emails stats for user dashboard for particular user
@router.get("/user/emails")
async def get_user_emails(db: AsyncSession = Depends(get_db), user: User = Depends(get_db)):
    result = await db.execute(select(EmailRecord).where(EmailRecord.user_id == user.id))
    records = result.scalars().all()
    return [r.to_dict() for r in records]

@router.get("/validation-stats/weekly")
async def get_weekly_stats(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)  # <-- this is key
):
    from sqlalchemy import func
    from datetime import datetime, timedelta

    today = datetime.utcnow()
    week_ago = today - timedelta(days=7)

    result = await db.execute(
        select(
            func.to_char(EmailRecord.created_at, 'Dy').label("day"),
            func.count().label("emails")
        )
        .where(
            EmailRecord.user_id == user.id,  # ✅ Filter by current user
            EmailRecord.created_at >= week_ago
        )
        .group_by("day")
    )

    data = result.fetchall()
    return [{"day": row.day, "emails": row.emails} for row in data]

app.include_router(router, prefix="/admin")
app.include_router(router, prefix="/api")

app.include_router(signup_router)  