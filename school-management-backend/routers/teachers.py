from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from db import get_db
from models.models import Teacher as TeacherModel
from schemas.schemas import TeacherCreate, TeacherOut

router = APIRouter()


@router.get("/teachers", response_model=List[TeacherOut])
def get_teachers(db: Session = Depends(get_db)):
    return db.query(TeacherModel).all()


@router.post("/teachers", response_model=TeacherOut)
def add_teacher(teacher: TeacherCreate, db: Session = Depends(get_db)):
    new_teacher = TeacherModel(**teacher.dict())
    db.add(new_teacher)
    db.commit()
    db.refresh(new_teacher)
    return new_teacher


@router.put("/teachers/{teacher_id}")
def update_teacher(teacher_id: int, teacher: TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = db.query(TeacherModel).filter(TeacherModel.id == teacher_id).first()
    if not db_teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    for key, value in teacher.dict().items():
        setattr(db_teacher, key, value)

    db.commit()
    return {"message": "Teacher updated successfully"}


@router.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    teacher = db.query(TeacherModel).filter(TeacherModel.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")

    db.delete(teacher)
    db.commit()
    return {"message": "Teacher deleted successfully"}


@router.get("/teachers/count")
def get_teacher_count(db: Session = Depends(get_db)):
    count = db.query(TeacherModel).count()
    return {"count": count}
