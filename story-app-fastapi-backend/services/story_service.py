from sqlalchemy.orm import Session
from models.story import Story, Genre, IllustrationStyle, TargetAge
from typing import List, Optional
from .openai_service import generate_story

# Create a new story
def create_story(db: Session, title: str, content: str, author_id: int, genre: Genre, illustration_style: IllustrationStyle, target_age: TargetAge) -> Story:
    db_story = Story(title=title, content=content, author_id=author_id, genre=genre, illustration_style=illustration_style, target_age=target_age)
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story

# Get all stories
def get_stories(db: Session, skip: int = 0, limit: int = 100) -> List[Story]:
    return db.query(Story).offset(skip).limit(limit).all()

# Get a specific story by ID
def get_story(db: Session, story_id: int) -> Optional[Story]:
    return db.query(Story).filter(Story.id == story_id).first()

# Update a story
def update_story(db: Session, story_id: int, title: Optional[str] = None, content: Optional[str] = None, genre: Optional[Genre] = None, illustration_style: Optional[IllustrationStyle] = None, target_age: Optional[TargetAge] = None) -> Optional[Story]:
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story:
        update_data = {}
        if title is not None:
            update_data["title"] = title
        if content is not None:
            update_data["content"] = content
        if genre is not None:
            update_data["genre"] = genre
        if illustration_style is not None:
            update_data["illustration_style"] = illustration_style
        if target_age is not None:
            update_data["target_age"] = target_age

        db.query(Story).filter(Story.id == story_id).update(update_data)
        db.commit()
        db.refresh(db_story)
    return db_story

# Delete a story
def delete_story(db: Session, story_id: int) -> bool:
    db_story = db.query(Story).filter(Story.id == story_id).first()
    if db_story:
        db.delete(db_story)
        db.commit()
        return True
    return False

# Yeni fonksiyon: OpenAI ile hikaye oluştur
def create_story_with_ai(db: Session, title: str, author_id: int, genre: Genre, illustration_style: IllustrationStyle, target_age: TargetAge) -> Optional[Story]:
    # OpenAI ile hikaye içeriği oluştur
    content = generate_story(title, genre.value, target_age.value)

    if content is None:
        return None

    # Yeni hikayeyi veritabanına kaydet
    db_story = Story(
        title=title,
        content=content,
        author_id=author_id,
        genre=genre,
        illustration_style=illustration_style,
        target_age=target_age
    )
    db.add(db_story)
    db.commit()
    db.refresh(db_story)
    return db_story