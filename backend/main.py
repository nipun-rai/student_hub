from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from events import events_routes
from fastapi.staticfiles import StaticFiles # Import StaticFiles
# importing student_profiles as student router
from student_profiles import router as student_router
from courses import courses
from teacher import teacher_router
from QnA import router
# from database import Base, engine



app = FastAPI()

# Global CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the uploads directory to serve static files
# This makes files in the 'uploads' directory accessible at '/uploads/' URL path
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers with prefix
app.include_router(events_routes)
app.include_router(student_router)
app.include_router(courses)
app.include_router(teacher_router)
app.include_router(router)


@app.get("/")
def root():
    return {"message": "Welcome to Student Hub API"}

if __name__ == "__main__":
    import uvicorn
    # uvicorn.run("main:app", host="srv1142.hstgr.io", port=8000, reload=True)
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

    
