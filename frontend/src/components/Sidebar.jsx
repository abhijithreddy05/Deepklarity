import React from 'react';
import { PlusCircle, Search, Trash2 } from 'lucide-react';

const Sidebar = ({ 
  notes, 
  activeNote, 
  setActiveNote, 
  onAddNote, 
  searchQuery, 
  setSearchQuery,
  onDeleteNote
}) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">Notes App</h1>
        <button onClick={onAddNote} className="btn-primary" title="Create Note">
          <PlusCircle size={18} /> New
        </button>
      </div>

      <div className="search-container">
        <Search className="search-icon" />
        <input 
          type="text" 
          placeholder="Search notes..." 
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="notes-list">
        {notes.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? 'No notes found' : 'Click "New" to create a note'}
          </div>
        ) : (
          notes.map((note) => (
            <div 
              key={note.id} 
              className={`note-item ${activeNote === note.id ? 'active' : ''}`}
              onClick={() => setActiveNote(note.id)}
            >
              <div className="note-item-title">
                {note.title || 'Untitled Note'}
              </div>
              <div className="note-item-preview">
                {note.content ? note.content.substring(0, 50) + '...' : 'No content'}
              </div>
              <div className="note-item-date">
                {new Date(note.updatedAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
