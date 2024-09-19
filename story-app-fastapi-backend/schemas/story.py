from pydantic import BaseModel
from typing import Optional
from models.story import Genre, IllustrationStyle, TargetAge

# Base Pydantic model for Story
class StoryBase(BaseModel):
    title: str
    content: str
    genre: Genre
    illustration_style: IllustrationStyle
    target_age: TargetAge

# Pydantic model for story creation
class StoryCreate(StoryBase):
    author_id: int

# Pydantic model for story update
class StoryUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    genre: Optional[Genre] = None
    illustration_style: Optional[IllustrationStyle] = None
    target_age: Optional[TargetAge] = None

# Pydantic model for story response
class StoryResponse(StoryBase):
    id: int
    author_id: int

    class Config:
        orm_mode = True
        from_attributes = True

# Pydantic model for AI story creation
class StoryAICreate(BaseModel):
    title: str
    author_id: int
    genre: Genre
    illustration_style: IllustrationStyle
    target_age: TargetAge