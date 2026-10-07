from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.associations import user_hobbies


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    bio = Column(String(200), nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    hobbies = relationship("Hobby", secondary=user_hobbies, back_populates="users")
    created_communities = relationship("Community", back_populates="creator")
    community_memberships = relationship("CommunityMember", back_populates="user", cascade="all, delete-orphan")
    
    # passive_deletes=True allows DB to handle ON DELETE SET NULL for posts and comments without Python deleting them
    posts = relationship("Post", back_populates="author", passive_deletes=True)
    comments = relationship("Comment", back_populates="author", passive_deletes=True)
    
    likes = relationship("PostLike", back_populates="user", cascade="all, delete-orphan")
    created_events = relationship("Event", back_populates="creator")
    event_rsvps = relationship("EventRsvp", back_populates="user", cascade="all, delete-orphan")
