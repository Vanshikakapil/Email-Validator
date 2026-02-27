# routes/router.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models import EmailRecord
from auth import get_current_admin
from db import get_db
from auth import get_current_admin


import json, os, csv
from datetime import datetime

router = APIRouter()

USERS_FILE = "users.json"
LOG_FILE = "admin_logs.json"


def log_action(admin_email, action):
    logs = []
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            logs = json.load(f)
    logs.append({
        "timestamp": datetime.now().isoformat(),
        "admin": admin_email,
        "action": action
    })
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)

@router.get("/admin/logs")
def get_logs():
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            return json.load(f)
    return []

@router.get("/admin/users")
def get_all_users():
    with open(USERS_FILE, "r") as f:
        return json.load(f)

@router.put("/admin/block-user")
def block_user(email: str):
    with open(USERS_FILE, "r") as f:
        users = json.load(f)

    for user in users:
        if user["email"] == email:
            user["blocked"] = True
            break
    else:
        raise HTTPException(status_code=404, detail="User not found")

    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=2)
    return {"message": "User blocked"}

@router.get("/admin/emails")
async def get_all_email_records(
    db: AsyncSession = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    result = await db.execute(select(EmailRecord))
    return result.scalars().all()

@router.get("/overview")
async def get_email_validation_stats():
    stats = {
        "total_sessions": 0,
        "total_valid": 0,
        "total_invalid": 0,
        "total_emails": 0,
    }

    download_folder = "downloads"
    sessions = set()

    for filename in os.listdir(download_folder):
        if filename.endswith(".csv"):
            parts = filename.split("-")
            if len(parts) >= 2:
                session_id = parts[0]
                file_type = parts[1].replace(".csv", "")
                sessions.add(session_id)
                file_path = os.path.join(download_folder, filename)
                with open(file_path, newline='', encoding='utf-8') as f:
                    reader = csv.reader(f)
                    rows = list(reader)[1:]  # skip header
                    if file_type == "valid":
                        stats["total_valid"] += len(rows)
                    elif file_type == "invalid":
                        stats["total_invalid"] += len(rows)
                    stats["total_emails"] += len(rows)

    stats["total_sessions"] = len(sessions)
    return stats
