from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.security import hash_password, verify_password
from app.models.user import User
from app.models.hobby import Hobby
from app.models.community import CommunityMember
from app.models.post import Post
from app.schemas.user import UserCreate, UserUpdate, UserProfileResponse


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(func.lower(User.email) == email.strip().lower()).first()


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    return db.query(User).filter(func.lower(User.username) == username.strip().lower()).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, user_in: UserCreate) -> User:
    """Create a new user with duplicate email and username conflict checks."""
    if get_user_by_email(db, user_in.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists"
        )
    
    if get_user_by_username(db, user_in.username):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This username is already taken"
        )

    db_user = User(
        username=user_in.username.strip(),
        name=user_in.name.strip(),
        email=user_in.email.strip().lower(),
        hashed_password=hash_password(user_in.password),
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Verify email and password."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_user_profile(db: Session, user: User, update_data: UserUpdate) -> User:
    """Update profile details with username uniqueness checks."""
    if update_data.username and update_data.username != user.username:
        existing = get_user_by_username(db, update_data.username)
        if existing and existing.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This username is already taken"
            )
        user.username = update_data.username.strip()

    if update_data.name is not None:
        user.name = update_data.name.strip()
    if update_data.bio is not None:
        user.bio = update_data.bio.strip()
    if update_data.avatar_url is not None:
        user.avatar_url = update_data.avatar_url.strip()

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_profile_data(db: Session, user: User) -> UserProfileResponse:
    """Fetch user profile with aggregate stats (joined communities, posts count)."""
    joined_communities_count = (
        db.query(func.count(CommunityMember.id))
        .filter(CommunityMember.user_id == user.id)
        .scalar() or 0
    )
    posts_count = (
        db.query(func.count(Post.id))
        .filter(Post.author_id == user.id)
        .scalar() or 0
    )

    return UserProfileResponse(
        id=user.id,
        username=user.username,
        name=user.name,
        email=user.email,
        bio=user.bio,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        hobbies=user.hobbies,
        joined_communities_count=joined_communities_count,
        posts_count=posts_count,
    )


def update_user_hobbies(db: Session, user: User, hobby_ids: List[int]) -> User:
    """Update user's selected hobbies."""
    hobbies = db.query(Hobby).filter(Hobby.id.in_(hobby_ids)).all()
    user.hobbies = hobbies
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_all_hobbies(db: Session) -> List[Hobby]:
    """List all available hobbies."""
    return db.query(Hobby).order_by(Hobby.name.asc()).all()


def seed_default_hobbies_if_empty(db: Session) -> None:
    """Pre-populate default hobby categories for onboarding if database has no hobbies."""
    count = db.query(func.count(Hobby.id)).scalar()
    if count == 0:
        default_hobbies = [
            ("Pottery & Ceramics", "brush", "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=600&q=80"),
            ("Mechanical Keyboards", "keyboard", "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80"),
            ("Urban Gardening", "potted_plant", "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80"),
            ("Analog Photography", "photo_camera", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80"),
            ("Coffee Brewing & Latte Art", "coffee", "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"),
            ("Woodworking & Carpentry", "handyman", "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80"),
            ("Retro Gaming & Modding", "sports_esports", "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80"),
            ("Sourdough Baking", "bakery_dining", "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=600&q=80"),
            ("Bouldering & Climbing", "landscape", "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=600&q=80"),
            ("Book Club & Literature", "menu_book", "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80"),
        ]
        for name, icon, image_url in default_hobbies:
            hobby = Hobby(
                name=name,
                normalized_name=name.strip().lower(),
                icon=icon,
                image_url=image_url
            )
            db.add(hobby)
        db.commit()
