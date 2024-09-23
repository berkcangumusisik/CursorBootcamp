from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.types import Enum as SQLAlchemyEnum
from enum import Enum
from .base import Base
from .user import User  # User modelini import ediyoruz

# Enum class for story genres
class Genre(str, Enum):
    FANTASY = "FANTASY"
    ADVENTURE = "ADVENTURE"
    MYSTERY = "MYSTERY"
    SCIENCE_FICTION = "SCIENCE_FICTION"
    FAIRY_TALE = "FAIRY_TALE"
    # Diğer türleri ekleyin...

# Enum class for illustration styles
class IllustrationStyle(str, Enum):
    CARTOON = "CARTOON"
    REALISTIC = "REALISTIC"
    WATERCOLOR = "WATERCOLOR"
    DIGITAL = "DIGITAL"
    # Diğer stilleri ekleyin...

# Enum class for target age groups
class TargetAge(str, Enum):
    AGE_0_3 = "AGE_0_3"
    AGE_4_6 = "AGE_4_6"
    AGE_7_9 = "AGE_7_9"
    AGE_10_12 = "AGE_10_12"

# Story model representing the stories table in the database
class Story(Base):
    __tablename__ = "stories"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    # Story title, indexed for faster queries
    title = Column(String, index=True)
    # Story content
    content = Column(String)
    # Foreign key to link to the author (user)
    user_id = Column(Integer, ForeignKey("users.id"))
    # Relationship to the User model
    user = relationship("User", back_populates="stories")
    # Genre of the story, using the Genre enum
    genre = Column(SQLAlchemyEnum(Genre), nullable=False)
    # Illustration style of the story, using the IllustrationStyle enum
    illustration_style = Column(SQLAlchemyEnum(IllustrationStyle), nullable=False)
    # Target age for the story, using the TargetAge enum
    target_age = Column(SQLAlchemyEnum(TargetAge), nullable=False)

    # String representation of the Story object
    def __repr__(self):
        return f"<Story(id={self.id}, title='{self.title}', genre={self.genre}, illustration_style={self.illustration_style}, target_age={self.target_age})>"