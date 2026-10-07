from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user, get_current_user_optional
from app.models.user import User
from app.schemas.community import (
    CommunityCreate,
    CommunityUpdate,
    CommunityResponse,
    CommunityDetailResponse,
)
from app.services.community_service import (
    create_community,
    list_communities,
    get_community_detail,
    update_community,
    delete_community,
    join_community,
    leave_community,
)

router = APIRouter(prefix="/communities", tags=["Communities"])


@router.get("", response_model=List[CommunityResponse])
def read_communities(
    category: Optional[str] = Query(None, description="Filter by category"),
    hobby_id: Optional[int] = Query(None, description="Filter by hobby ID"),
    search: Optional[str] = Query(None, description="Search by name or description"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """List communities with optional category/hobby/search filters."""
    current_user_id = current_user.id if current_user else None
    return list_communities(
        db,
        category=category,
        hobby_id=hobby_id,
        search=search,
        current_user_id=current_user_id,
        limit=limit,
        offset=offset,
    )


@router.post("", response_model=CommunityResponse, status_code=status.HTTP_201_CREATED)
def create_new_community(
    community_in: CommunityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new community. Creator automatically becomes admin member."""
    return create_community(db, community_in, current_user)


@router.get("/{community_id}", response_model=CommunityDetailResponse)
def read_community(
    community_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """Get community details including recent members."""
    current_user_id = current_user.id if current_user else None
    return get_community_detail(db, community_id, current_user_id)


@router.put("/{community_id}", response_model=CommunityResponse)
def edit_community(
    community_id: int,
    update_data: CommunityUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update community details. Owner-only (403 otherwise)."""
    return update_community(db, community_id, update_data, current_user)


@router.delete("/{community_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a community. Owner-only; cascades to memberships, posts, events."""
    delete_community(db, community_id, current_user)
    return None


@router.post("/{community_id}/join", response_model=CommunityResponse)
def join_existing_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Join a community. Idempotent — re-joining does not duplicate membership."""
    return join_community(db, community_id, current_user)


@router.post("/{community_id}/leave", response_model=CommunityResponse)
def leave_existing_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Leave a community. Owner cannot leave without transferring ownership (400)."""
    return leave_community(db, community_id, current_user)
