from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.models import Event  # Assuming your Event model is in models/models.py
from schemas.schemas import EventCreate, EventOut
from db import get_db  # From your updated db.py

router = APIRouter()

# Get all events (ordered by date ascending)
@router.get("/events", response_model=List[EventOut])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).order_by(Event.event_date.asc()).all()

# Add a new event
@router.post("/events", response_model=EventOut)
def add_event(event: EventCreate, db: Session = Depends(get_db)):
    new_event = Event(**event.dict())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

# Delete an event
@router.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(event)
    db.commit()
    return {"message": "Event deleted successfully"}

# Count of all events
@router.get("/events/count")
def get_event_count(db: Session = Depends(get_db)):
    count = db.query(Event).count()
    return {"count": count}
