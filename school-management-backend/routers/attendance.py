from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from db import get_db
from models.models import Attendance
from schemas.schemas import AttendanceCreate, AttendanceOut

router = APIRouter()


@router.post("/attendance", tags=["Attendance"])
def mark_attendance(records: List[AttendanceCreate], db: Session = Depends(get_db)):
    """
    Mark attendance for a list of students.
    If a record exists for today, update it; otherwise, insert a new one.
    """
    for record in records:
        existing = db.query(Attendance).filter(
            Attendance.student_id == record.student_id,
            Attendance.date == record.date
        ).first()

        if existing:
            existing.status = record.status  # Update status
        else:
            new_attendance = Attendance(**record.dict())
            db.add(new_attendance)

    db.commit()
    return {"message": "Attendance recorded successfully"}


@router.get("/attendance/rate", tags=["Attendance"])
def get_attendance_rate(db: Session = Depends(get_db)):
    """
    Return today's attendance rate in percentage.
    """
    today = date.today()
    total = db.query(Attendance).filter(Attendance.date == today).count()
    present = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status == "present"
    ).count()

    rate = (present / total * 100) if total > 0 else 0
    return {"rate": round(rate, 2)}


@router.get("/attendance/today", response_model=List[AttendanceOut], tags=["Attendance"])
def get_today_attendance(db: Session = Depends(get_db)):
    """
    Return all attendance records for today.
    """
    today = date.today()
    records = db.query(Attendance).filter(Attendance.date == today).all()
    return records
