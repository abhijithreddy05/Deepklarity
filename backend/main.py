from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List

from .database import engine, Base, get_db
from . import models
from .services.scraper import scrape_recipe_page
from .services.llm_processor import process_recipe_text

# Create database tables (if they don't exist)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe Extractor API")

# Add CORS so React frontend can call this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExtractRequest(BaseModel):
    url: str

@app.post("/api/extract")
def extract_recipe(req: ExtractRequest, db: Session = Depends(get_db)):
    # 1. Check if we already processed this URL
    existing_recipe = db.query(models.Recipe).filter(models.Recipe.url == req.url).first()
    if existing_recipe:
        # Return existing to save API tokens
        return {
            "id": existing_recipe.id,
            "url": existing_recipe.url,
            "title": existing_recipe.title,
            "cuisine": existing_recipe.cuisine,
            "prep_time": existing_recipe.prep_time,
            "cook_time": existing_recipe.cook_time,
            "total_time": existing_recipe.total_time,
            "servings": existing_recipe.servings,
            "difficulty": existing_recipe.difficulty,
            "ingredients": existing_recipe.ingredients,
            "instructions": existing_recipe.instructions,
            "nutrition_estimate": existing_recipe.nutrition_estimate,
            "substitutions": existing_recipe.substitutions,
            "shopping_list": existing_recipe.shopping_list,
            "related_recipes": existing_recipe.related_recipes
        }
    
    # 2. Scrape the URL
    try:
        raw_text = scrape_recipe_page(req.url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
        
    if not str(raw_text).strip():
         raise HTTPException(status_code=400, detail="Page content is empty or unreadable.")
         
    # 3. Process to JSON using LangChain LLM
    try:
        structured_data = process_recipe_text(raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Generation Failed: {str(e)}")
        
    # 4. Save to Database
    new_recipe = models.Recipe(
        url=req.url,
        title=structured_data["title"],
        cuisine=structured_data["cuisine"],
        prep_time=structured_data["prep_time"],
        cook_time=structured_data["cook_time"],
        total_time=structured_data["total_time"],
        servings=structured_data["servings"],
        difficulty=structured_data["difficulty"],
        ingredients=structured_data["ingredients"],
        instructions=structured_data["instructions"],
        nutrition_estimate=structured_data["nutrition_estimate"],
        substitutions=structured_data["substitutions"],
        shopping_list=structured_data["shopping_list"],
        related_recipes=structured_data["related_recipes"]
    )
    
    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)
    
    # 5. Return Output
    response = structured_data.copy()
    response["id"] = new_recipe.id
    response["url"] = new_recipe.url
    return response

@app.get("/api/history")
def get_history(db: Session = Depends(get_db)):
    recipes = db.query(models.Recipe).order_by(models.Recipe.created_at.desc()).all()
    # Format according to History requirements
    results = []
    for r in recipes:
        results.append({
            "id": r.id,
            "title": r.title,
            "cuisine": r.cuisine,
            "difficulty": r.difficulty,
            "date_extracted": r.created_at.isoformat() if r.created_at else None,
            "url": r.url,
            # include full data for the Modal
            "full_data": {
                "prep_time": r.prep_time,
                "cook_time": r.cook_time,
                "total_time": r.total_time,
                "servings": r.servings,
                "ingredients": r.ingredients,
                "instructions": r.instructions,
                "nutrition_estimate": r.nutrition_estimate,
                "substitutions": r.substitutions,
                "shopping_list": r.shopping_list,
                "related_recipes": r.related_recipes
            }
        })
    return results
