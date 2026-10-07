from sqlalchemy import Table, Column, Integer, ForeignKey
from app.core.database import Base

# Association table for User <-> Hobby many-to-many relationship
user_hobbies = Table(
    "user_hobbies",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("hobby_id", Integer, ForeignKey("hobbies.id", ondelete="CASCADE"), primary_key=True)
)
