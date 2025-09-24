from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")

db = client["smart_classroom"]

admins = db["admins"]
faculty = db["faculty"]
classroom = db["classroom"]
batch = db["batch"]
subject = db["subject"]
timetable = db["timetable"]
print("Database connected successfully")