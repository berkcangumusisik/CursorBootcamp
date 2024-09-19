from sqlalchemy import Column, Integer, String, Text
from .base import Base

class Criteria(Base):
    __tablename__ = "criteria"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)