import React, { useState } from 'react';
import RecipeDisplay from './RecipeDisplay';

const RecipeExtractor = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recipeData, setRecipeData] = useState(null);

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setRecipeData(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to extract recipe.');
      }

      setRecipeData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-container animate-fade-in">
      <div className="extractor-hero">
        <h1>Recipe Extractor</h1>
        <p>Paste a recipe blog URL below to magically extract ingredients, instructions, and generate smart meal plans.</p>
        
        <form onSubmit={handleExtract} className="extract-form">
          <input 
            type="url" 
            placeholder="e.g., https://www.allrecipes.com/recipe/..." 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="url-input"
          />
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Extracting...' : 'Extract Recipe'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing recipe and generating nutrition & substitutions...</p>
        </div>
      )}

      {recipeData && !loading && (
        <div className="results-container animate-slide-up">
          <RecipeDisplay data={recipeData} />
        </div>
      )}
    </div>
  );
};

export default RecipeExtractor;
