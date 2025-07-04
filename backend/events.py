from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import mysql.connector

# Create the router
events_routes = APIRouter()

# DB Connection
db = mysql.connector.connect(
    host="127.0.0.1",
    user="root",
    password="mysql",
    database="student_hub"

    # host="srv1142.hstgr.io",
    # user="u666185638_studenthub",
    # password="Nipunrai@123",
    # database="u666185638_studenthub"
)

cursor = db.cursor()

# Pydantic schema
class Event(BaseModel):
    id: int = None
    name: str
    date: str
    time: str
    venue: str

@events_routes.get("/events", response_model=List[Event])
def get_events():
    cursor.execute("SELECT * FROM events")
    events = cursor.fetchall()
    print(type(events))
    return [Event(id=e[0], name=e[1], date=e[2], time=e[3], venue=e[4]) for e in events]

@events_routes.post("/events", response_model=Event)
def create_event(event: Event):
    cursor.execute("INSERT INTO events (name, date, time, venue) VALUES (%s, %s, %s, %s)",
                   (event.name, event.date, event.time, event.venue))
    db.commit()
    event.id = cursor.lastrowid
    return event

@events_routes.put("/events/{event_id}", response_model=Event)
def update_event(event_id: int, event: Event):
    cursor.execute("UPDATE events SET name=%s, date=%s, time=%s, venue=%s WHERE id=%s",
                   (event.name, event.date, event.time, event.venue, event_id))
    db.commit()
    return {**event.dict(), "id": event_id}

@events_routes.delete("/events/{event_id}")
def delete_event(event_id: int):
    cursor.execute("DELETE FROM events WHERE id = %s", (event_id,))
    db.commit()
    return {"message": "Event deleted successfully"}