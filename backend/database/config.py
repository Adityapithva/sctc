from pymongo import MongoClient

client = MongoClient("mongodb+srv://theboys8122422_db_user:T3I97VzscegvDahL@sctc.wy7mzow.mongodb.net/?retryWrites=true&w=majority&appName=sctc")

db = client["smart_classroom"]

admins = db["admins"]
faculty = db["faculty"]
classroom = db["classroom"]
batch = db["batch"]
subject = db["subject"]
timetable = db["timetable"]
print("Database connected successfully")