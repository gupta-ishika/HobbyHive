from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.models.associations import user_hobbies


class Hobby(Base):
    __tablename__ = "hobbies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    normalized_name = Column(String(100), unique=True, index=True, nullable=False)
    icon = Column(String(100), nullable=True)  # Material symbol name
    image_url = Column(String(500), nullable=True)

    # Relationships
    users = relationship("User", secondary=user_hobbies, back_populates="hobbies")
    communities = relationship("Community", back_populates="hobby")
