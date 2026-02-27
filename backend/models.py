from db import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, func
from datetime import datetime
from sqlalchemy.orm import relationship

# ✅ Table: Registered users
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # or "admin"
    blocked = Column(Boolean, default=False)
    status = Column(String, default="pending")

    # ✅ Relationship with email records
    email_records = relationship("EmailRecord", back_populates="user")

# ✅ Table: Validated email records
class EmailRecord(Base):
    __tablename__ = "email_records"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, nullable=False)
    regex = Column(String)
    mx = Column(String)
    smtp = Column(String)
    status = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ Foreign key to link to a user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="email_records")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "regex": self.regex,
            "mx": self.mx,
            "smtp": self.smtp,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


