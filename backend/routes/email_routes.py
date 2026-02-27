from fastapi import APIRouter

router = APIRouter()

@router.post("/validate-email/")
async def validate_email():
    return {"message": "Email validation route working"}
