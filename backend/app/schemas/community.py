from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserResponse
from app.schemas.hobby import HobbyResponse


class CommunityBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., max_length=1000)
    category: str
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    rules: Optional[str] = None
    hobby_id: Optional[int] = None


class CommunityCreate(CommunityBase):
    pass


class CommunityUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, max_length=1000)
    category: Optional[str] = None
    avatar_url: Optional[str] = None
    banner_url: Optional[str] = None
    rules: Optional[str] = None
    hobby_id: Optional[int] = None


class CommunityMemberResponse(BaseModel):
    id: int
    user_id: int
    community_id: int
    role: str
    joined_at: datetime
    user: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


class CommunityResponse(CommunityBase):
    id: int
    normalized_name: str
    creator_id: int
    created_at: datetime
    members_count: int = 0
    posts_count: int = 0
    is_member: bool = False
    hobby: Optional[HobbyResponse] = None
    creator: Optional[UserResponse] = None

    model_config = ConfigDict(from_attributes=True)


class CommunityDetailResponse(CommunityResponse):
    rules: Optional[str] = None
    members: List[CommunityMemberResponse] = []
