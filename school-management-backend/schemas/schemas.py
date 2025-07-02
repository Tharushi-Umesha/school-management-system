from pydantic import BaseModel
from datetime import date
from typing import Optional

# --------------------------
# STUDENT SCHEMA
# --------------------------

class LoginData(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        orm_mode = True
class StudentBase(BaseModel):
    name: str
    age: int
    grade: str
    email: str

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class StudentOut(StudentBase):
    id: int

    class Config:
        orm_mode = True

# --------------------------
# TEACHER SCHEMA
# --------------------------
class TeacherBase(BaseModel):
    name: str
    subject: str
    email: str
    phone: str

class TeacherCreate(TeacherBase):
    pass

class TeacherUpdate(TeacherBase):
    pass

class TeacherOut(TeacherBase):
    id: int

    class Config:
        orm_mode = True

# --------------------------
# EVENT SCHEMA
# --------------------------
class EventBase(BaseModel):
    title: str
    event_date: date
    description: str

class EventCreate(EventBase):
    pass

class EventOut(EventBase):
    id: int

    class Config:
        orm_mode = True

# --------------------------
# ATTENDANCE SCHEMA
# --------------------------
class AttendanceCreate(BaseModel):
    student_id: int
    date: date
    status: str  # 'present' or 'absent'

    class Config:
        orm_mode = True


class AttendanceOut(BaseModel):
    id: int
    student_id: int
    date: date
    status: str

    class Config:
        orm_mode = True
