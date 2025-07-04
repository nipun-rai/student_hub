from fastapi import APIRouter, HTTPException, Request
import mysql.connector

router = APIRouter()

db_config = {
    # "host": "127.0.0.1",
    # "user": "root",
    # "password": "mysql",
    # "database": "student_hub"

    "host":"srv1142.hstgr.io",
    "user":"u666185638_studenthub",
    "password":"Nipunrai@123",
    "database":"u666185638_studenthub"
}

@router.post("/questions")
def create_question(request: Request):
    data = request.json()
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO questions (title, description, tags, posted_by) VALUES (%s, %s, %s, %s)",
                   (data['title'], data['description'], data['tags'], data['posted_by']))
    conn.commit()
    conn.close()
    return {"message": "Question posted"}

@router.get("/questions")
def get_questions():
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM questions ORDER BY created_at DESC")
    result = cursor.fetchall()
    conn.close()
    return result

@router.post("/answers")
def post_answer(request: Request):
    data = request.json()
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO answers (question_id, content, posted_by) VALUES (%s, %s, %s)",
                   (data['question_id'], data['content'], data['posted_by']))
    conn.commit()
    conn.close()
    return {"message": "Answer submitted"}

@router.get("/answers/{question_id}")
def get_answers(question_id: int):
    conn = mysql.connector.connect(**db_config)
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM answers WHERE question_id = %s ORDER BY upvotes DESC", (question_id,))
    result = cursor.fetchall()
    conn.close()
    return result
