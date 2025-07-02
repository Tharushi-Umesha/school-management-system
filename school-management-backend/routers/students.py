from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from models.models import Student as StudentModel
from schemas.schemas import StudentCreate, StudentOut

router = APIRouter()


@router.get("/students", response_model=List[StudentOut])
def get_students(db: Session = Depends(get_db)):
    return db.query(StudentModel).all()


@router.post("/students", response_model=StudentOut)
def add_student(student: StudentCreate, db: Session = Depends(get_db)):
    new_student = StudentModel(**student.dict())
    db.add(new_student)
    db.commit()
    db.refresh(new_student)
    return new_student


@router.put("/students/{student_id}")
def update_student(student_id: int, student: StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")

    for key, value in student.dict().items():
        setattr(db_student, key, value)

    db.commit()
    return {"message": "Student updated successfully"}


@router.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.query(StudentModel).filter(StudentModel.id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    db.delete(student)
    db.commit()
    return {"message": "Student deleted successfully"}


@router.get("/students/count")
def get_student_count(db: Session = Depends(get_db)):
    count = db.query(StudentModel).count()
    return {"count": count}
