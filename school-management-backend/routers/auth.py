# routers/auth.py

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db import get_db
from models.models import User
from schemas.schemas import LoginData, UserOut

router = APIRouter()


@router.post("/login", response_model=UserOut, tags=["Auth"])
async def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        User.username == data.username,
        User.password == data.password  # ✅ For production: hash and compare
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return user
