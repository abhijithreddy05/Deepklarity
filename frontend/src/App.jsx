import React, { useState } from 'react';
import RecipeExtractor from './components/RecipeExtractor';
import RecipeHistory from './components/RecipeHistory';

function App() {
  const [activeTab, setActiveTab] = useState('extract');

  return (
    <div className="app-container">
      <nav className="top-nav">
        <div className="logo">🍲 DeepKlarity Meals</div>
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'extract' ? 'active' : ''}`}
            onClick={() => setActiveTab('extract')}
          >
            Tab 1 - Extract Recipe
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Tab 2 - Saved Recipes
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'extract' ? <RecipeExtractor /> : <RecipeHistory />}
      </main>
    </div>
  );
}

export default App;
