from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from .database import Base

class Recipe(Base):
    __tablename__ = "recipes"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    cuisine = Column(String)
    prep_time = Column(String)
    cook_time = Column(String)
    total_time = Column(String)
    servings = Column(Integer)
    difficulty = Column(String)
    
    # Store complex structures as JSON
    ingredients = Column(JSON)       # List of dicts: quantity, unit, item
    instructions = Column(JSON)      # List of strings
    nutrition_estimate = Column(JSON) # Dict: calories, protein, carbs, fat
    substitutions = Column(JSON)      # List of strings
    shopping_list = Column(JSON)      # Dict grouping by category
    related_recipes = Column(JSON)    # List of strings
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
