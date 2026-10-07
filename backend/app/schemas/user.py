import re
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict, field_validator
from app.schemas.hobby import HobbyResponse

USERNAME_REGEX = re.compile(r"^[a-zA-Z0-9_]{3,20}$")


class UserBase(BaseModel):
    username: str
    name: str
    email: EmailStr
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not USERNAME_REGEX.fullmatch(v):
            raise ValueError(
                "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
            )
        return v


class UserCreate(BaseModel):
    username: str
    name: str
    email: EmailStr
    password: str

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str) -> str:
        if not USERNAME_REGEX.fullmatch(v):
            raise ValueError(
                "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
            )
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and not USERNAME_REGEX.fullmatch(v):
            raise ValueError(
                "Username must be 3-20 characters long and contain only letters, numbers, and underscores"
            )
        return v


class UserResponse(BaseModel):
    id: int
    username: str
    name: str
    email: EmailStr
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    hobbies: List[HobbyResponse] = []

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(UserResponse):
    joined_communities_count: int = 0
    posts_count: int = 0


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
