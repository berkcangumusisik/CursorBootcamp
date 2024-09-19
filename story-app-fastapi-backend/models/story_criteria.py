from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base

class StoryCriteria(Base):
    __tablename__ = "story_criteria"

    id = Column(Integer, primary_key=True, index=True)
    story_id = Column(Integer, ForeignKey("stories.id"))
    criteria_id = Column(Integer, ForeignKey("criteria.id"))
    value = Column(String)

    story = relationship("Story")
    criteria = relationship("Criteria")