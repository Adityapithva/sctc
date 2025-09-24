from fastapi import FastAPI,HTTPException,File,UploadFile
from database.config import db,admins,faculty,classroom,batch,subject,timetable
from database.models import Admin,LoginRequest
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from gemini_client import generate_timetable
from fastapi.encoders import jsonable_encoder
from bson.json_util import dumps, loads
import json

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#entry point
@app.get("/")
async def read_root():
    return {"message": "welcome to smart classroom & timetable scheduler apis"}

#for admin creation(initialization)
@app.post("/create_admin")
def create_admin(admin: Admin):
    if admins.find_one({"email": admin.email}):
        raise HTTPException(status_code=400, detail="Admin already exists")
    
    admins.insert_one(admin.model_dump())
    return {"message": "Admin created successfully", "admin": admin}

#admin login
@app.post("/login")
def login(data:LoginRequest):
    admin = admins.find_one({"email": data.email, "password": data.password})
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful"}

#upload csv data to specified collection
@app.post("/upload-csv/{collection_name}")
async def upload_csv(collection_name: str,file:UploadFile= File(...)):
    try:
        df = pd.read_csv(file.file)
        records = df.to_dict(orient="records")
        collection = db[collection_name]
        collection.insert_many(records)
        return {"message": f"Data uploaded to {collection_name} collection successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
#get data from specified collection
@app.get("/get-data/{collection_name}")
def get_data(collection_name: str):
    collection = db[collection_name]
    data = list(collection.find({}, {"_id": 0})) 
    return {"data": data}

#generate time table
@app.get("/generate-timetable")
def generate_timetable_api():

    classrooms_data = loads(dumps(list(classroom.find({}))))
    batches_data = loads(dumps(list(batch.find({}))))
    subjects_data = loads(dumps(list(subject.find({}))))
    faculties_data = loads(dumps(list(faculty.find({}))))

    prompt = f"""
You are an expert academic planner AI. Generate a valid timetable.
Classrooms: {classrooms_data}
Batches: {batches_data}
Subjects: {subjects_data}
Faculties: {faculties_data}

Return only JSON, no explanation.

Schema:
[
    {{
    "batch": "str",
    "day": "str",
    "time_slot": "str",
    "sub_code": "str",
    "faculty_id": "str",
    "room_id": "str",
    "approved": false
    }}
]

Rules:
1. Each subject scheduled exactly classes_per_week times per week.
2. Max 6 classes per batch per day.
3. Faculty ≤ max_classes_per_day.
4. Classroom not double-booked.
5. Room capacity ≥ batch size.
6. Labs only in Lab rooms.
7. Distribute evenly Mon-Fri.
"""
    raw_output = generate_timetable(prompt)
    
    # Parse JSON safely
    try:
        timetable_json = json.loads(raw_output)
    except Exception as e:
        return {"error": f"Failed to parse Gemini output: {str(e)}", "raw_output": raw_output}
    for entry in timetable_json:
        entry.pop("_id", None)
    timetable.delete_many({})
    timetable.insert_many(timetable_json)
    return {"timetable": timetable_json}

#fetch generated timetable
@app.get("/get-timetable")
async def get_timetable():
    # Fetch the latest timetable (assuming latest inserted one is needed)
    tt = list(timetable.find({}, {"_id": 0}))

    if not tt:
        raise HTTPException(status_code=404, detail="No timetable found")
    
    return {"timetable": tt}

@app.get("/dashboard-stats")
async def get_dashboard_stats():
    faculty_count =  db["faculty"].count_documents({})
    classroom_count =  db["classroom"].count_documents({})
    subject_count =  db["subject"].count_documents({})
    batch_count =  db["batch"].count_documents({})

    # Subject distribution
    subject_distribution = db["faculty"].aggregate([
        {"$project": {"subject_count": {"$size": {"$split": ["$subjects", ";"]}}}},
        {"$group": {"_id": None, "avg_subjects": {"$avg": "$subject_count"}}}
    ]).to_list(None)

    # Classroom type distribution
    classroom_types = db["classroom"].aggregate([
        {"$group": {"_id": "$type", "count": {"$sum": 1}}}
    ]).to_list(None)

    return {
        "faculty_count": faculty_count,
        "classroom_count": classroom_count,
        "subject_count": subject_count,
        "batch_count": batch_count,
        "avg_subjects_per_faculty": subject_distribution[0]["avg_subjects"] if subject_distribution else 0,
        "classroom_types": classroom_types
    }