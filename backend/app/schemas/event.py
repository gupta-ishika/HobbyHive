from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserResponse


class EventRsvpCreate(BaseModel):
    status: str = Field(default="going", pattern=r"^(going|interested)$")


class EventRsvpResponse(BaseModel):
    id: int
    user_id: int
    event_id: int
    status: str
    created_at: datetime
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


class EventBase(BaseModel):
    title: str = Field(..., max_length=200)
    description: str
    starts_at: datetime
    location: str = Field(..., max_length=255)
    is_online: bool = False
    meeting_link: Optional[str] = None
    community_id: int


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    starts_at: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    is_online: Optional[bool] = None
    meeting_link: Optional[str] = None


class EventResponse(EventBase):
    id: int
    creator_id: int
    created_at: datetime
    going_count: int = 0
    interested_count: int = 0
    user_rsvp_status: Optional[str] = None
    is_past: bool = False
    creator: Optional[UserResponse] = None
    rsvps: List[EventRsvpResponse] = []

    model_config = ConfigDict(from_attributes=True)
