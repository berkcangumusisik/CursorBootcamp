from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from data.database import get_db
from models.story import Story
from services import story_service
from schemas.story import StoryCreate, StoryUpdate, StoryResponse, StoryAICreate

# Create a router for story-related endpoints
router = APIRouter()

# Create a new story
@router.post("/", response_model=StoryResponse)
def create_story(story: StoryCreate, db: Session = Depends(get_db)):
    return story_service.create_story(db=db, **story.dict())

# Get all stories
@router.get("/", response_model=List[StoryResponse])
def read_stories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    stories = story_service.get_stories(db, skip=skip, limit=limit)
    return stories

# Get a specific story
@router.get("/{story_id}", response_model=StoryResponse)
def read_story(story_id: int, db: Session = Depends(get_db)):
    db_story = story_service.get_story(db, story_id=story_id)
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return db_story

# Update a story
@router.put("/{story_id}", response_model=StoryResponse)
def update_story(story_id: int, story: StoryUpdate, db: Session = Depends(get_db)):
    db_story = story_service.update_story(db, story_id=story_id, **story.dict(exclude_unset=True))
    if db_story is None:
        raise HTTPException(status_code=404, detail="Story not found")
    return db_story

# Delete a story
@router.delete("/{story_id}", response_model=bool)
def delete_story(story_id: int, db: Session = Depends(get_db)):
    success = story_service.delete_story(db, story_id=story_id)
    if not success:
        raise HTTPException(status_code=404, detail="Story not found")
    return success

# OpenAI ile yeni bir hikaye oluştur
@router.post("/ai-create/", response_model=StoryResponse)
def create_story_with_ai(story: StoryAICreate, db: Session = Depends(get_db)):
    db_story = story_service.create_story_with_ai(db=db, **story.dict())
    if db_story is None:
        raise HTTPException(status_code=500, detail="Hikaye oluşturulamadı")
    return StoryResponse.from_orm(db_story)