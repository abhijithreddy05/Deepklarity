import React, { useState, useEffect } from 'react';
import RecipeDisplay from './RecipeDisplay';

const RecipeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="tab-container animate-fade-in">
      <h2>Saved Recipes (History)</h2>
      
      {loading ? (
        <div className="loading-state"><div className="spinner"></div></div>
      ) : history.length === 0 ? (
        <div className="empty-state">No recipes extracted yet. Extract one in Tab 1!</div>
      ) : (
        <div className="history-table-wrapper">
          <table className="history-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Cuisine</th>
                <th>Difficulty</th>
                <th>Extracted On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.cuisine}</td>
                  <td><span className={`badge diff-${item.difficulty || 'medium'}`}>{item.difficulty}</span></td>
                  <td>{new Date(item.date_extracted).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => setSelectedRecipe(item.full_data)}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRecipe && (
        <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedRecipe(null)}>&times;</button>
            <RecipeDisplay data={selectedRecipe} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeHistory;
