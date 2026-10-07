from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.community import Community
from app.models.event import Event, EventRsvp
from app.models.user import User
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventRsvpCreate,
    EventRsvpResponse,
)


def get_event_by_id(db: Session, event_id: int) -> Optional[Event]:
    return db.query(Event).filter(Event.id == event_id).first()


def _ensure_aware(dt: datetime) -> datetime:
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def format_event_response(
    db: Session,
    event: Event,
    current_user_id: Optional[int] = None,
) -> EventResponse:
    going_count = (
        db.query(func.count(EventRsvp.id))
        .filter(EventRsvp.event_id == event.id, EventRsvp.status == "going")
        .scalar() or 0
    )
    interested_count = (
        db.query(func.count(EventRsvp.id))
        .filter(EventRsvp.event_id == event.id, EventRsvp.status == "interested")
        .scalar() or 0
    )

    user_rsvp_status: Optional[str] = None
    if current_user_id:
        rsvp = (
            db.query(EventRsvp)
            .filter(
                EventRsvp.event_id == event.id,
                EventRsvp.user_id == current_user_id,
            )
            .first()
        )
        if rsvp:
            user_rsvp_status = rsvp.status

    is_past = _ensure_aware(event.starts_at) < datetime.now(timezone.utc)

    return EventResponse(
        id=event.id,
        title=event.title,
        description=event.description,
        starts_at=event.starts_at,
        location=event.location,
        is_online=event.is_online,
        meeting_link=event.meeting_link,
        community_id=event.community_id,
        creator_id=event.creator_id,
        created_at=event.created_at,
        going_count=going_count,
        interested_count=interested_count,
        user_rsvp_status=user_rsvp_status,
        is_past=is_past,
        creator=event.creator,
        rsvps=event.rsvps,
    )


def create_event(db: Session, event_in: EventCreate, creator: User) -> EventResponse:
    community = db.query(Community).filter(Community.id == event_in.community_id).first()
    if not community:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found",
        )

    if _ensure_aware(event_in.starts_at) < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Event start time must be in the future",
        )

    event = Event(
        title=event_in.title.strip(),
        description=event_in.description.strip(),
        starts_at=event_in.starts_at,
        location=event_in.location.strip(),
        is_online=event_in.is_online,
        meeting_link=event_in.meeting_link,
        community_id=event_in.community_id,
        creator_id=creator.id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)

    return format_event_response(db, event, current_user_id=creator.id)


def list_events(
    db: Session,
    community_id: Optional[int] = None,
    upcoming_only: bool = False,
    search: Optional[str] = None,
    current_user_id: Optional[int] = None,
    limit: int = 50,
    offset: int = 0,
) -> List[EventResponse]:
    query = db.query(Event)

    if community_id:
        query = query.filter(Event.community_id == community_id)

    if upcoming_only:
        query = query.filter(Event.starts_at >= datetime.now(timezone.utc))

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        query = query.filter(
            or_(
                func.lower(Event.title).like(search_pattern),
                func.lower(Event.description).like(search_pattern),
                func.lower(Event.location).like(search_pattern),
            )
        )

    events = query.order_by(Event.starts_at.asc()).offset(offset).limit(limit).all()
    return [format_event_response(db, e, current_user_id) for e in events]


def get_event_detail(
    db: Session,
    event_id: int,
    current_user_id: Optional[int] = None,
) -> EventResponse:
    event = get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )
    return format_event_response(db, event, current_user_id)


def update_event(
    db: Session,
    event_id: int,
    update_data: EventUpdate,
    current_user: User,
) -> EventResponse:
    event = get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    if event.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the event creator can edit this event",
        )

    if update_data.title is not None:
        event.title = update_data.title.strip()
    if update_data.description is not None:
        event.description = update_data.description.strip()
    if update_data.starts_at is not None:
        if _ensure_aware(update_data.starts_at) < datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Event start time must be in the future",
            )
        event.starts_at = update_data.starts_at
    if update_data.location is not None:
        event.location = update_data.location.strip()
    if update_data.is_online is not None:
        event.is_online = update_data.is_online
    if update_data.meeting_link is not None:
        event.meeting_link = update_data.meeting_link

    db.add(event)
    db.commit()
    db.refresh(event)
    return format_event_response(db, event, current_user.id)


def delete_event(db: Session, event_id: int, current_user: User) -> None:
    event = get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    if event.creator_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the event creator can delete this event",
        )

    db.delete(event)
    db.commit()


def upsert_rsvp(
    db: Session,
    event_id: int,
    rsvp_in: EventRsvpCreate,
    user: User,
) -> EventRsvpResponse:
    event = get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    existing = (
        db.query(EventRsvp)
        .filter(EventRsvp.event_id == event.id, EventRsvp.user_id == user.id)
        .first()
    )

    if existing:
        # Re-selecting a status updates the existing RSVP (no duplicates)
        existing.status = rsvp_in.status
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return EventRsvpResponse.model_validate(existing)

    rsvp = EventRsvp(
        user_id=user.id,
        event_id=event.id,
        status=rsvp_in.status,
    )
    db.add(rsvp)
    db.commit()
    db.refresh(rsvp)
    return EventRsvpResponse.model_validate(rsvp)


def cancel_rsvp(db: Session, event_id: int, user: User) -> None:
    event = get_event_by_id(db, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Event not found",
        )

    existing = (
        db.query(EventRsvp)
        .filter(EventRsvp.event_id == event.id, EventRsvp.user_id == user.id)
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="RSVP not found",
        )

    db.delete(existing)
    db.commit()
