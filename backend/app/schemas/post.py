from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserResponse


class PostImageBase(BaseModel):
    url: str
    public_id: Optional[str] = None
    position: int = Field(..., ge=0, le=4)


class PostImageCreate(PostImageBase):
    pass


class PostImageResponse(PostImageBase):
    id: int
    post_id: int

    model_config = ConfigDict(from_attributes=True)


class CommentBase(BaseModel):
    content: str = Field(..., max_length=500)
    parent_comment_id: Optional[int] = None


class CommentCreate(CommentBase):
    pass


class CommentResponse(BaseModel):
    id: int
    content: str
    author_id: Optional[int] = None
    post_id: int
    parent_comment_id: Optional[int] = None
    created_at: datetime
    author: Optional[UserResponse] = None
    replies: List["CommentResponse"] = []

    model_config = ConfigDict(from_attributes=True)


class PostBase(BaseModel):
    title: str = Field(..., max_length=200)
    content: str = Field(..., max_length=2000)
    community_id: int


class PostCreate(PostBase):
    images: Optional[List[PostImageCreate]] = []


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    content: Optional[str] = Field(None, max_length=2000)


class PostResponse(PostBase):
    id: int
    author_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    author: Optional[UserResponse] = None
    likes_count: int = 0
    comments_count: int = 0
    is_liked: bool = False
    images: List[PostImageResponse] = []
    comments: List[CommentResponse] = []

    model_config = ConfigDict(from_attributes=True)


class LikeToggleResponse(BaseModel):
    post_id: int
    is_liked: bool
    likes_count: int


CommentResponse.model_rebuild()
