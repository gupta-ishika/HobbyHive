from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Community(Base):
    __tablename__ = "communities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)
    normalized_name = Column(String(50), unique=True, index=True, nullable=False)
    description = Column(String(1000), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    avatar_url = Column(String(500), nullable=True)
    banner_url = Column(String(500), nullable=True)
    rules = Column(Text, nullable=True)
    creator_id = Column(Integer, ForeignKey("users.id", ondelete="RESTRICT"), nullable=False)
    hobby_id = Column(Integer, ForeignKey("hobbies.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    __table_args__ = (
        CheckConstraint("length(name) >= 3", name="check_community_name_min_length"),
    )

    # Relationships
    creator = relationship("User", back_populates="created_communities")
    hobby = relationship("Hobby", back_populates="communities")
    members = relationship("CommunityMember", back_populates="community", cascade="all, delete-orphan")
    posts = relationship("Post", back_populates="community", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="community", cascade="all, delete-orphan")


class CommunityMember(Base):
    __tablename__ = "community_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    community_id = Column(Integer, ForeignKey("communities.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(20), default="member", nullable=False)  # "member", "admin"
    joined_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    __table_args__ = (
        UniqueConstraint("user_id", "community_id", name="uq_user_community"),
    )

    # Relationships
    user = relationship("User", back_populates="community_memberships")
    community = relationship("Community", back_populates="members")
