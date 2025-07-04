
# backend/student_profiles.py
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import shutil
import os
import mysql.connector
from mysql.connector import Error
import uuid # For unique filenames

router = APIRouter()

# DB Connection Setup
def get_connection():
    try:
        conn = mysql.connector.connect(
            # host="127.0.0.1",
            # user="root",
            # password="mysql", # IMPORTANT: Replace with your actual MySQL password
            # database="student_hub"

            host="srv1142.hstgr.io",
            user="u666185638_studenthub",
            password="Nipunrai@123",
            database="u666185638_studenthub"
        )
        return conn
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        raise HTTPException(status_code=500, detail="Database connection error")

# Pydantic Model for response (includes id)
class StudentProfileResponse(BaseModel):
    id: int
    name: str # <--- NEW FIELD
    registration_id: str
    application_number: str
    email: str
    phone: str
    program: str
    department: str
    batch_year: int
    academic_status: str
    current_year: str
    current_term: str
    quota: str
    admission_type: str
    section: str
    profile_photo: Optional[str] = None # Path to the photo

# Ensure upload directory exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# Helper to convert DB row to Pydantic model
def row_to_student_profile(row):
    if not row:
        return None
    try:
        # IMPORTANT: Adjust indexing based on your DB table's column order.
        # Assuming the order is now: id, name, reg_id, app_num, email, phone, program, dept, batch_year, status, current_year, current_term, quota, admission_type, section, profile_photo
        return StudentProfileResponse(
            id=row[0],
            name=row[1], # <--- NEW FIELD INDEX
            registration_id=row[2],
            application_number=row[3],
            email=row[4],
            phone=row[5],
            program=row[6],
            department=row[7],
            batch_year=row[8],
            academic_status=row[9],
            current_year=row[10],
            current_term=row[11],
            quota=row[12],
            admission_type=row[13],
            section=row[14],
            profile_photo=row[15] # Updated index for photo
        )
    except Exception as e:
        print(f"Error converting row to StudentProfileResponse: {row} - {e}")
        raise HTTPException(status_code=500, detail=f"Data integrity error in database row: {e}. Please check database column order and data types.")


# --- CRUD Endpoints ---

@router.post("/student_profiles/", response_model=StudentProfileResponse)
async def create_student_profile(
    name: str = Form(...), # <--- NEW FIELD
    registration_id: str = Form(...),
    application_number: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    program: str = Form(...),
    department: str = Form(...),
    batch_year: int = Form(...),
    academic_status: str = Form(...),
    current_year: str = Form(...),
    current_term: str = Form(...),
    quota: str = Form(...),
    admission_type: str = Form(...),
    section: str = Form(...),
    profile_photo: Optional[UploadFile] = File(None)
):
    photo_path = None
    if profile_photo:
        if not profile_photo.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")
        
        unique_filename = f"{uuid.uuid4()}_{profile_photo.filename}"
        file_location = os.path.join(UPLOAD_DIR, unique_filename)
        
        try:
            with open(file_location, "wb") as buffer:
                shutil.copyfileobj(profile_photo.file, buffer)
            photo_path = file_location
        except Exception as e:
            print(f"Error saving profile photo: {e}")
            raise HTTPException(status_code=500, detail="Could not save profile photo")

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO student_profiles (
                name, registration_id, application_number, email, phone, program, department,
                batch_year, academic_status, current_year, current_term, quota,
                admission_type, section, profile_photo
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            name, # <--- NEW FIELD
            registration_id, application_number, email, phone, program, department,
            batch_year, academic_status, current_year, current_term, quota,
            admission_type, section, photo_path
        ))
        conn.commit()
        
        student_id = cursor.lastrowid
        cursor.execute("SELECT * FROM student_profiles WHERE id = %s", (student_id,))
        new_student_row = cursor.fetchone()
        new_student = row_to_student_profile(new_student_row)
        
    except mysql.connector.errors.IntegrityError as err:
        conn.rollback()
        if err.errno == 1062:
            raise HTTPException(status_code=409, detail=f"A profile with this email, registration ID, or application number already exists: {err.msg}")
        else:
            print(f"Database integrity error during student profile creation: {err}")
            raise HTTPException(status_code=500, detail=f"Database integrity error: {err}")
    except Error as err:
        conn.rollback()
        print(f"Database error during student profile creation: {err}")
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()

    return new_student

@router.get("/student_profiles/", response_model=List[StudentProfileResponse])
def get_all_student_profiles():
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM student_profiles")
        rows = cursor.fetchall()
        students = [row_to_student_profile(row) for row in rows]
    except Error as err:
        print(f"Database error during fetching all profiles: {err}")
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return students

@router.get("/student_profiles/{student_id}", response_model=StudentProfileResponse)
def get_student_profile(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT * FROM student_profiles WHERE id = %s", (student_id,))
        row = cursor.fetchone()
        if row is None:
            raise HTTPException(status_code=404, detail="Student profile not found")
        student = row_to_student_profile(row)
    except Error as err:
        print(f"Database error during fetching profile {student_id}: {err}")
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()
    return student

@router.put("/student_profiles/{student_id}", response_model=StudentProfileResponse)
async def update_student_profile(
    student_id: int,
    name: str = Form(...), # <--- NEW FIELD ADDED HERE
    registration_id: str = Form(...),
    application_number: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    program: str = Form(...),
    department: str = Form(...),
    batch_year: int = Form(...),
    academic_status: str = Form(...),
    current_year: str = Form(...),
    current_term: str = Form(...),
    quota: str = Form(...),
    admission_type: str = Form(...),
    section: str = Form(...),
    profile_photo: Optional[UploadFile] = File(None) # Optional file update
):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT profile_photo FROM student_profiles WHERE id = %s", (student_id,))
    existing_photo_data = cursor.fetchone()
    existing_photo_path = existing_photo_data[0] if existing_photo_data else None

    photo_path_to_db = existing_photo_path

    if profile_photo:
        if not profile_photo.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

        unique_filename = f"{uuid.uuid4()}_{profile_photo.filename}"
        new_file_location = os.path.join(UPLOAD_DIR, unique_filename)
        
        try:
            with open(new_file_location, "wb") as buffer:
                shutil.copyfileobj(profile_photo.file, buffer)
            photo_path_to_db = new_file_location

            if existing_photo_path and os.path.exists(existing_photo_path) and existing_photo_path != new_file_location:
                try:
                    os.remove(existing_photo_path)
                    print(f"Deleted old photo: {existing_photo_path}")
                except OSError as e:
                    print(f"Error deleting old photo {existing_photo_path}: {e}")

        except Exception as e:
            print(f"Error saving new profile photo during update: {e}")
            raise HTTPException(status_code=500, detail="Could not save new profile photo")

    try:
        # <--- UPDATED SQL UPDATE STATEMENT and VALUES: 'name = %s,' was missing
        cursor.execute("""
            UPDATE student_profiles SET
                name = %s, registration_id = %s, application_number = %s, email = %s, phone = %s,
                program = %s, department = %s, batch_year = %s, academic_status = %s,
                current_year = %s, current_term = %s, quota = %s, admission_type = %s,
                section = %s, profile_photo = %s
            WHERE id = %s
        """, (
            name, # <--- NEW FIELD VALUE
            registration_id, application_number, email, phone, program, department,
            batch_year, academic_status, current_year, current_term, quota,
            admission_type, section, photo_path_to_db, student_id
        ))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Student profile not found or no changes made")

        cursor.execute("SELECT * FROM student_profiles WHERE id = %s", (student_id,))
        updated_student_row = cursor.fetchone()
        updated_student = row_to_student_profile(updated_student_row)

    except mysql.connector.errors.IntegrityError as err:
        conn.rollback()
        if err.errno == 1062:
            raise HTTPException(status_code=409, detail=f"A profile with this email, registration ID, or application number already exists: {err.msg}")
        else:
            print(f"Database integrity error during student profile update {student_id}: {err}")
            raise HTTPException(status_code=500, detail=f"Database error: {err}")
    except Error as err:
        conn.rollback()
        print(f"Database error during student profile update {student_id}: {err}")
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()

    return updated_student


@router.delete("/student_profiles/{student_id}")
def delete_student_profile(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT profile_photo FROM student_profiles WHERE id = %s", (student_id,))
    photo_to_delete_row = cursor.fetchone()
    photo_to_delete_path = photo_to_delete_row[0] if photo_to_delete_row else None

    try:
        cursor.execute("DELETE FROM student_profiles WHERE id = %s", (student_id,))
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Student profile not found")

        if photo_to_delete_path and os.path.exists(photo_to_delete_path):
            try:
                os.remove(photo_to_delete_path)
                print(f"Deleted photo file: {photo_to_delete_path}")
            except OSError as e:
                print(f"Error deleting file {photo_to_delete_path}: {e}")

    except Error as err:
        conn.rollback()
        print(f"Database error during student profile deletion {student_id}: {err}")
        raise HTTPException(status_code=500, detail=f"Database error: {err}")
    finally:
        cursor.close()
        conn.close()

    return {"message": "Student profile deleted successfully"}