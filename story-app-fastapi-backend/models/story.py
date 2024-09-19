from sqlalchemy import Column, Integer, String, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .base import Base
import enum

# Enum class for story genres
class Genre(enum.Enum):
    FANTASY = "Fantasy"
    SCIENCE_FICTION = "Science Fiction"
    ADVENTURE = "Adventure"
    MYSTERY = "Mystery"
    FAIRY_TALE = "Fairy Tale"
    FABLE = "Fable"
    HISTORICAL = "Historical"
    EDUCATIONAL = "Educational"

# Enum class for illustration styles
class IllustrationStyle(enum.Enum):
    CARTOON = "Cartoon"
    REALISTIC = "Realistic"
    WATERCOLOR = "Watercolor"
    DIGITAL_ART = "Digital Art"
    PENCIL_SKETCH = "Pencil Sketch"
    ANIME = "Anime"
    MINIMALIST = "Minimalist"
    COLLAGE = "Collage"

# Enum class for target age groups
class TargetAge(enum.Enum):
    AGE_0_3 = "0-3 Yaş"
    AGE_4_6 = "4-6 Yaş"
    AGE_7_9 = "7-9 Yaş"
    AGE_10_12 = "10-12 Yaş"

# Story model representing the stories table in the database
class Story(Base):
    __tablename__ = "stories"

    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    # Story title, indexed for faster queries
    title = Column(String(100), index=True, nullable=False)
    # Story content
    content = Column(Text, nullable=False)
    # Foreign key to link to the author (user)
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    # Relationship to the User model
    author = relationship("User", back_populates="stories")
    # Genre of the story, using the Genre enum
    genre = Column(Enum(Genre), nullable=False)
    # Illustration style of the story, using the IllustrationStyle enum
    illustration_style = Column(Enum(IllustrationStyle), nullable=False)
    # Target age for the story, using the TargetAge enum
    target_age = Column(Enum(TargetAge), nullable=False)

    # String representation of the Story object
    def __repr__(self):
        return f"<Story(id={self.id}, title='{self.title}', genre={self.genre}, illustration_style={self.illustration_style}, target_age={self.target_age})>"