
from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
import mysql.connector
import shutil
import os

teacher_router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def get_db_connection():
    return mysql.connector.connect(
        host="127.0.0.1",
        user="root",
        password="mysql",
        database="student_hub"

        # host="srv1142.hstgr.io",
        # user="u666185638_studenthub",
        # password="Nipunrai@123",
        # database="u666185638_studenthub"
    )

@teacher_router.post("/teachers/")
async def add_teacher(
    name: str = Form(...),
    role: str = Form(...),
    rating: float = Form(...),
    program: str = Form(...),
    course: str = Form(...),
    status: str = Form(...),
    profile_image: UploadFile = File(None)
):
    image_filename = None
    if profile_image:
        image_filename = profile_image.filename
        with open(f"{UPLOAD_DIR}/{image_filename}", "wb") as f:
            shutil.copyfileobj(profile_image.file, f)

    conn = get_db_connection()
    cursor = conn.cursor()
    query = """
        INSERT INTO teachers 
        (name, role, rating, program, course, profile_image, status) 
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(query, (
        name, role, rating, program, course, image_filename, status
    ))
    conn.commit()
    cursor.close()
    conn.close()

    return JSONResponse(content={"message": "Teacher added successfully."})

@teacher_router.get("/teachers/")
def get_teachers():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM teachers")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    return results

@teacher_router.delete("/teachers/{teacher_id}")
def delete_teacher(teacher_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM teachers WHERE id = %s", (teacher_id,))
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Teacher deleted"}

@teacher_router.put("/teachers/{teacher_id}")
async def update_teacher(
    teacher_id: int,
    name: str = Form(...),
    role: str = Form(...),
    rating: float = Form(...),
    program: str = Form(...),
    course: str = Form(...),
    status: str = Form(...),
    profile_image: UploadFile = File(None)
):
    conn = get_db_connection()
    cursor = conn.cursor()

    image_filename = None
    if profile_image:
        image_filename = profile_image.filename
        with open(f"{UPLOAD_DIR}/{image_filename}", "wb") as f:
            shutil.copyfileobj(profile_image.file, f)

    query = """
        UPDATE teachers SET 
        name=%s, role=%s, rating=%s, program=%s, course=%s, status=%s
        {}
        WHERE id=%s
    """.format(", profile_image=%s" if profile_image else "")

    params = (name, role, rating, program, course, status)
    if profile_image:
        params += (image_filename, teacher_id)
    else:
        params += (teacher_id,)

    cursor.execute(query, params)
    conn.commit()
    cursor.close()
    conn.close()
    return {"message": "Teacher updated"}





