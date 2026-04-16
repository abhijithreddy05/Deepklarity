import os
from typing import List, Dict, Optional
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

# Pydantic schemas for structured output

class Ingredient(BaseModel):
    quantity: str = Field(description="Amount of the ingredient, e.g., '4', '1/2', 'approx', or '-' if unknown")
    unit: str = Field(description="Unit of measurement, e.g., 'slices', 'cups', 'tbsp', or '-' if none")
    item: str = Field(description="The ingredient name itself, e.g., 'white bread'")

class NutritionEstimate(BaseModel):
    calories: int = Field(description="Estimated calories per serving")
    protein: str = Field(description="Estimated protein (e.g., '12g')")
    carbs: str = Field(description="Estimated carbohydrates (e.g., '30g')")
    fat: str = Field(description="Estimated fat (e.g., '20g')")

class StructuredRecipe(BaseModel):
    title: str = Field(description="The title of the recipe")
    cuisine: str = Field(description="The cuisine type (e.g., American, Italian)")
    prep_time: str = Field(description="Preparation time, e.g., '5 mins', or 'N/A' if not specified")
    cook_time: str = Field(description="Cooking time, e.g., '10 mins', or 'N/A' if not specified")
    total_time: str = Field(description="Total time required")
    servings: int = Field(description="Number of servings (integer)")
    difficulty: str = Field(description="Difficulty level: 'easy', 'medium', or 'hard'")
    ingredients: List[Ingredient] = Field(description="List of ingredients with quantity, unit, and item separated")
    instructions: List[str] = Field(description="Step by step cooking instructions")
    nutrition_estimate: NutritionEstimate = Field(description="Nutritional estimate per serving")
    substitutions: List[str] = Field(description="Exactly 3 ingredient substitutions for dietary alternatives")
    shopping_list: Dict[str, List[str]] = Field(description="Shopping list grouped by generic category keys (e.g., 'dairy', 'produce', 'pantry', 'bakery')")
    related_recipes: List[str] = Field(description="Exactly 3 related recipes that pair well")

RECIPE_EXTRACTION_PROMPT = \"\"\"You are an expert chef and recipe data extractor AI.
Below is the raw, unformatted text scraped from a recipe blog page.

Your task is to carefully analyze this text and extract all relevant recipe information.
If the exact times or servings are missing, estimate them reasonably based on the instructions.
For nutrition, generate a reasonable estimate per serving.
Provide exactly 3 useful substitutions.
Group the shopping list items sensibly (e.g., dairy, bakery, produce, meat, pantry).
Provide 3 related recipe suggestions.

You MUST follow the requested JSON schema accurately.

RAW RECIPE TEXT:
{scraped_text}
\"\"\"

def process_recipe_text(text: str) -> dict:
    \"\"\"
    Sends unstructured text to Gemini and retrieves a structured Recipe object using LangChain.
    \"\"\"
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise Exception("GEMINI_API_KEY environment variable is not set. Please provide it in the backend/.env file.")
        
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
        max_retries=2
    )
    
    # LangChain v0.1+ native structured output capability:
    structured_llm = llm.with_structured_output(StructuredRecipe)
    
    prompt = PromptTemplate.from_template(RECIPE_EXTRACTION_PROMPT)
    chain = prompt | structured_llm
    
    result = chain.invoke({"scraped_text": text[:35000]}) # Limit tokens slightly if page is massive
    return result.model_dump()
