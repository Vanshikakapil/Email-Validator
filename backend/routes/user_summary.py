from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from db import get_db
from models import EmailRecord, User
from auth import get_current_user

router = APIRouter()

@router.get("/user/summary")
def get_user_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        email_records = db.query(EmailRecord).filter(EmailRecord.user_id == current_user.id).all()

        total = len(email_records)
        valid = sum(1 for record in email_records if record.regex == "Valid")
        invalid = total - valid
        last_validation = max([r.created_at for r in email_records], default=None)

        summary = {
            "total_validations": total,
            "valid_emails": valid,
            "invalid_emails": invalid,
            "last_validated": last_validation,
        }
        return summary

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
