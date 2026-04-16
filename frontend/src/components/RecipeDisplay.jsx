import React from 'react';

const RecipeDisplay = ({ data }) => {
  if (!data) return null;

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <h2>{data.title}</h2>
        <div className="badges">
          <span className="badge">{data.cuisine}</span>
          <span className={`badge diff-${data.difficulty || 'medium'}`}>{data.difficulty}</span>
        </div>
      </div>
      
      <div className="recipe-meta">
        <div><strong>Prep Time:</strong> {data.prep_time}</div>
        <div><strong>Cook Time:</strong> {data.cook_time}</div>
        <div><strong>Total Time:</strong> {data.total_time}</div>
        <div><strong>Servings:</strong> {data.servings}</div>
      </div>
      
      <div className="recipe-grid">
        <div className="ingredients-section">
          <h3>Ingredients</h3>
          <ul>
            {data.ingredients?.map((ing, idx) => (
              <li key={idx}>
                <strong>{ing.quantity} {ing.unit !== '-' ? ing.unit : ''}</strong> {ing.item}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="instructions-section">
          <h3>Instructions</h3>
          <ol>
            {data.instructions?.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="recipe-bottom-grid">
        <div className="nutrition-card">
          <h3>Nutrition Estimate</h3>
          <p><strong>Calories:</strong> {data.nutrition_estimate?.calories}</p>
          <p><strong>Protein:</strong> {data.nutrition_estimate?.protein}</p>
          <p><strong>Carbs:</strong> {data.nutrition_estimate?.carbs}</p>
          <p><strong>Fat:</strong> {data.nutrition_estimate?.fat}</p>
        </div>

        <div className="substitutions-card">
          <h3>Substitutions</h3>
          <ul>
            {data.substitutions?.map((sub, idx) => (
              <li key={idx}>{sub}</li>
            ))}
          </ul>
        </div>

        <div className="shopping-card">
          <h3>Shopping List</h3>
          {data.shopping_list && Object.entries(data.shopping_list).map(([category, items], idx) => (
             <div key={idx} className="shop-category">
               <strong>{category.toUpperCase()}:</strong> {items.join(', ')}
             </div>
          ))}
        </div>
      </div>

      <div className="related-section">
        <h3>Related Recipes</h3>
        <div className="related-tags">
          {data.related_recipes?.map((rel, idx) => (
             <span key={idx} className="related-tag">{rel}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDisplay;
