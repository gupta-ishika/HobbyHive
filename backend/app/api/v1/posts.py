from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.post import (
    PostCreate,
    PostUpdate,
    PostResponse,
    CommentCreate,
    CommentResponse,
    LikeToggleResponse,
)
from app.services.post_service import (
    create_post,
    list_posts,
    get_post_detail,
    update_post,
    delete_post,
    toggle_like,
    create_comment,
    delete_comment,
)

router = APIRouter(prefix="/posts", tags=["Posts & Feed"])


@router.get("", response_model=List[PostResponse])
def read_posts(
    community_id: Optional[int] = Query(None, description="Filter by community ID"),
    author_id: Optional[int] = Query(None, description="Filter by author ID"),
    search: Optional[str] = Query(None, description="Search by title or content"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Fetch feed posts with optional community/author/search filters."""
    current_user_id = current_user.id if current_user else None
    return list_posts(
        db,
        community_id=community_id,
        author_id=author_id,
        search=search,
        current_user_id=current_user_id,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
def create_new_post(
    post_in: PostCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a post in a community. 404 if the community does not exist."""
    return create_post(db, post_in, current_user)


@router.get("/{post_id}", response_model=PostResponse)
def read_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get a single post with likes, images, and nested comments."""
    current_user_id = current_user.id if current_user else None
    return get_post_detail(db, post_id, current_user_id)


@router.put("/{post_id}", response_model=PostResponse)
def edit_post(
    post_id: int,
    update_data: PostUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Edit a post. Author-only (403 otherwise)."""
    return update_post(db, post_id, update_data, current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a post. Author-only; cascades to likes, comments, and images."""
    delete_post(db, post_id, current_user)
    return None


@router.post("/{post_id}/like", response_model=LikeToggleResponse)
def toggle_post_like(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Toggle like on a post. Liked -> unliked (and vice versa)."""
    return toggle_like(db, post_id, current_user)


@router.post(
    "/{post_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_comment(
    post_id: int,
    comment_in: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a comment (or reply via parent_comment_id) to a post."""
    return create_comment(db, post_id, comment_in, current_user)


@router.delete(
    "/{post_id}/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_comment(
    post_id: int,
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a comment. Comment-author-only (403 otherwise)."""
    delete_comment(db, post_id, comment_id, current_user)
    return None
