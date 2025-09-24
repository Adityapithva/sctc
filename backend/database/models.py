from pydantic import BaseModel,EmailStr
from typing import List

class Classroom(BaseModel):
    room_no: str
    capacity: int
    type: str  # e.g., 'Lecture Hall', 'Lab', etc.
    availability: bool = True

class Batch(BaseModel):
    batch_name:str
    sem:int
    student_count:int

class Subject(BaseModel):
    sub_code: str
    sub_name: str
    sem: int
    classes_per_week: int

class Faculty(BaseModel):
    name:str
    subjects:List[str]
    max_classes_per_day: int
    avg_leaves_per_month: int = 0

class timetable(BaseModel):
    batch:str
    day:str
    time_slot:str
    sub_code:str
    faculty_id:str
    room_id:str
    approved:bool = False

class Admin(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "admin"

class LoginRequest(BaseModel):
    email: EmailStr
    password: str