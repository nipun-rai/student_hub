# courses.py
from fastapi import APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

courses = APIRouter()

class CourseBase(BaseModel):
    """Base model for course data."""
    program_name: str 
    course_name: str 
    duration: str 
    course_level: str 

class CourseCreate(CourseBase):
    """Model for creating a new course (inherits from CourseBase)."""
    pass

class CourseUpdate(CourseBase):
    """Model for updating an existing course (inherits from CourseBase)."""
    pass

class CourseInDB(CourseBase):
    """Model for a course as stored in the database (includes id)."""
    id: int

    class Config:
        """Pydantic configuration to enable ORM mode."""
        orm_mode = True # This is for compatibility with SQLAlchemy, but good practice.


# --- Database Connection and Utility Functions ---

def get_db_connection():
    """Establishes and returns a database connection."""
    try:
        conn = mysql.connector.connect(
            host="127.0.0.1",
            user="root",
            password="mysql",
            database="student_hub"

            # host="srv1142.hstgr.io",
            # user="u666185638_studenthub",
            # password="Nipunrai@123",
            # database="u666185638_studenthub"
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to MySQL: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database connection failed"
        )

# --- API Endpoints (CRUD Operations) ---

@courses.get("/courses/", response_model=list[CourseInDB], summary="Retrieve all courses")
async def read_courses():
    """
    Retrieves a list of all courses from the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True) # Use dictionary=True to get results as dicts
    try:
        cursor.execute("SELECT id, program_name, course_name, duration, course_level FROM courses")
        courses = cursor.fetchall()
        return courses
    except mysql.connector.Error as err:
        print(f"Error fetching courses: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve courses"
        )
    finally:
        cursor.close()
        conn.close()

@courses.post("/courses/", response_model=CourseInDB, status_code=status.HTTP_201_CREATED, summary="Create a new course")
async def create_course(course: CourseCreate):
    """
    Creates a new course in the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        query = """
            INSERT INTO courses (program_name, course_name, duration, course_level)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(query, (course.program_name, course.course_name, course.duration, course.course_level))
        conn.commit()
        new_course_id = cursor.lastrowid # Get the ID of the newly inserted row

        # Fetch the created course to return it with its ID
        cursor.execute(
            "SELECT id, program_name, course_name, duration, course_level FROM courses WHERE id = %s",
            (new_course_id,)
        )
        created_course = cursor.fetchone()
        return CourseInDB(
            id=new_course_id,
            program_name=created_course[1],
            course_name=created_course[2],
            duration=created_course[3],
            course_level=created_course[4]
        )
    except mysql.connector.Error as err:
        conn.rollback() # Rollback changes if an error occurs
        print(f"Error creating course: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create course"
        )
    finally:
        cursor.close()
        conn.close()

@courses.get("/courses/{course_id}", response_model=CourseInDB, summary="Retrieve a single course by ID")
async def read_course(course_id: int):
    """
    Retrieves a single course by its ID.
    Raises 404 if the course is not found.
    """
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute(
            "SELECT id, program_name, course_name, duration, course_level FROM courses WHERE id = %s",
            (course_id,)
        )
        course = cursor.fetchone()
        if course is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        return course
    except mysql.connector.Error as err:
        print(f"Error fetching course by ID: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve course"
        )
    finally:
        cursor.close()
        conn.close()

@courses.put("/courses/{course_id}", response_model=CourseInDB, summary="Update an existing course")
async def update_course(course_id: int, course: CourseUpdate):
    """
    Updates an existing course in the database.
    Raises 404 if the course is not found.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if the course exists first
        cursor.execute("SELECT id FROM courses WHERE id = %s", (course_id,))
        if cursor.fetchone() is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

        query = """
            UPDATE courses
            SET program_name = %s, course_name = %s, duration = %s, course_level = %s
            WHERE id = %s
        """
        cursor.execute(query, (course.program_name, course.course_name, course.duration, course.course_level, course_id))
        conn.commit()

        # Fetch the updated course to return it
        cursor.execute(
            "SELECT id, program_name, course_name, duration, course_level FROM courses WHERE id = %s",
            (course_id,)
        )
        updated_course_data = cursor.fetchone()
        return CourseInDB(
            id=course_id,
            program_name=updated_course_data[1],
            course_name=updated_course_data[2],
            duration=updated_course_data[3],
            course_level=updated_course_data[4]
        )
    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Error updating course: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update course"
        )
    finally:
        cursor.close()
        conn.close()

@courses.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a course")
async def delete_course(course_id: int):
    """
    Deletes a course from the database.
    Raises 404 if the course is not found.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM courses WHERE id = %s", (course_id,))
        conn.commit()
        if cursor.rowcount == 0: # Check if any row was affected
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
        # No content to return for 204 status
    except mysql.connector.Error as err:
        conn.rollback()
        print(f"Error deleting course: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete course"
        )
    finally:
        cursor.close()
        conn.close()

# To run this backend, save it as courses.py and execute:
# uvicorn courses:app --reload --port 8000
