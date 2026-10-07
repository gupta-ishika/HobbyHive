from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user
from app.models.user import User
from app.schemas.user import UserUpdate, UserProfileResponse, UserResponse
from app.schemas.hobby import HobbyResponse, UserHobbiesUpdate
from app.services.user_service import (
    get_user_by_id,
    update_user_profile,
    get_user_profile_data,
    update_user_hobbies,
    get_all_hobbies,
    seed_default_hobbies_if_empty,
)

router = APIRouter(prefix="/users", tags=["Users & Onboarding"])


@router.get("/hobbies", response_model=List[HobbyResponse])
def list_hobbies(db: Session = Depends(get_db)):
    """List all available hobbies for exploration and onboarding selection."""
    seed_default_hobbies_if_empty(db)
    return get_all_hobbies(db)


@router.get("/profile", response_model=UserProfileResponse)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get the profile and statistics of the logged-in user."""
    return get_user_profile_data(db, current_user)


@router.get("/profile/{user_id}", response_model=UserProfileResponse)
def get_user_profile_by_id(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get public profile and statistics of any user by ID."""
    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return get_user_profile_data(db, user)


@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    update_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update profile details for the currently logged-in user."""
    updated_user = update_user_profile(db, current_user, update_data)
    return get_user_profile_data(db, updated_user)


@router.post("/hobbies", response_model=UserResponse)
def save_user_hobbies(
    hobbies_data: UserHobbiesUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Save/update the selected hobbies for the logged-in user (Onboarding)."""
    updated_user = update_user_hobbies(db, current_user, hobbies_data.hobby_ids)
    return updated_user
