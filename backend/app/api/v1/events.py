from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventRsvpCreate,
    EventRsvpResponse,
)
from app.services.event_service import (
    create_event,
    list_events,
    get_event_detail,
    update_event,
    delete_event,
    upsert_rsvp,
    cancel_rsvp,
)

router = APIRouter(prefix="/events", tags=["Events & Meetups"])


@router.get("", response_model=List[EventResponse])
def read_events(
    community_id: Optional[int] = Query(None, description="Filter by community ID"),
    upcoming_only: bool = Query(False, description="Show only upcoming events"),
    search: Optional[str] = Query(None, description="Search by title, description, or location"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """List events ordered by start time with optional filters."""
    current_user_id = current_user.id if current_user else None
    return list_events(
        db,
        community_id=community_id,
        upcoming_only=upcoming_only,
        search=search,
        current_user_id=current_user_id,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
def create_new_event(
    event_in: EventCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Schedule an event in a community. 404 if community missing, 400 if date is past."""
    return create_event(db, event_in, current_user)


@router.get("/{event_id}", response_model=EventResponse)
def read_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get a single event with RSVP counts and the caller's RSVP status."""
    current_user_id = current_user.id if current_user else None
    return get_event_detail(db, event_id, current_user_id)


@router.put("/{event_id}", response_model=EventResponse)
def edit_event(
    event_id: int,
    update_data: EventUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Edit an event. Creator-only (403 otherwise)."""
    return update_event(db, event_id, update_data, current_user)


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_event(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an event. Creator-only; cascades to all RSVPs."""
    delete_event(db, event_id, current_user)
    return None


@router.post("/{event_id}/rsvp", response_model=EventRsvpResponse)
def rsvp_to_event(
    event_id: int,
    rsvp_in: EventRsvpCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """RSVP to an event. Re-submitting a status updates the existing RSVP."""
    return upsert_rsvp(db, event_id, rsvp_in, current_user)


@router.delete("/{event_id}/rsvp", status_code=status.HTTP_204_NO_CONTENT)
def cancel_event_rsvp(
    event_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel the caller's RSVP. 404 if no RSVP exists."""
    cancel_rsvp(db, event_id, current_user)
    return None
