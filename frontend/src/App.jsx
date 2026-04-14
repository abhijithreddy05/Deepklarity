import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Trash2, Moon, Sun, CheckCircle, RefreshCcw } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import { useDebounce } from './hooks/useDebounce';
import { ThemeContext } from './context/ThemeContext';

const API_URL = 'http://localhost:5005/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const debouncedContent = useDebounce(editContent, 1000);
  const debouncedTitle = useDebounce(editTitle, 1000);

  // Initial Fetch based on search
  useEffect(() => {
    fetchNotes(debouncedSearch);
  }, [debouncedSearch]);

  // Handle Note selection and populate editor
  useEffect(() => {
    if (activeNoteId) {
      const activeNote = notes.find(n => n.id === activeNoteId);
      if (activeNote) {
        setEditTitle(activeNote.title || '');
        setEditContent(activeNote.content || '');
      }
    } else {
      setEditTitle('');
      setEditContent('');
    }
  }, [activeNoteId]); // Do not include notes dependency to avoid re-rendering content while typing

  // Debounced Save Effect
  useEffect(() => {
    if (activeNoteId) {
      const activeNote = notes.find(n => n.id === activeNoteId);
      // Ensure we only save if content actually changed
      if (activeNote && (activeNote.title !== debouncedTitle || activeNote.content !== debouncedContent)) {
        handleSaveNote(activeNoteId, debouncedTitle, debouncedContent);
      }
    }
  }, [debouncedContent, debouncedTitle, activeNoteId]);

  const fetchNotes = async (search = '') => {
    try {
      const response = await axios.get(`${API_URL}?search=${encodeURIComponent(search)}`);
      setNotes(response.data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      const newNote = { title: 'Untitled Note', content: '' };
      const response = await axios.post(API_URL, newNote);
      setNotes([response.data, ...notes]);
      setActiveNoteId(response.data.id);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleSaveNote = async (id, title, content) => {
    setSaveStatus('saving');
    try {
      const response = await axios.put(`${API_URL}/${id}`, { title, content });
      setNotes(prevNotes => 
        prevNotes.map(n => n.id === id ? response.data : n)
      );
      setSaveStatus('saved');
    } catch (error) {
      console.error('Failed to update note:', error);
      setSaveStatus('error');
    }
  };

  const handleDeleteNote = async () => {
    if (!activeNoteId) return;
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await axios.delete(`${API_URL}/${activeNoteId}`);
      const updatedNotes = notes.filter(n => n.id !== activeNoteId);
      setNotes(updatedNotes);
      setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const activeNote = notes.find(n => n.id === activeNoteId);

  return (
    <div className="app-container">
      <Sidebar 
        notes={notes}
        activeNote={activeNoteId}
        setActiveNote={setActiveNoteId}
        onAddNote={handleAddNote}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      
      <div className="main-content">
        <div className="main-header">
          {activeNote ? (
            <input 
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="search-input"
              style={{ width: '40%', fontSize: '1rem', fontWeight: 600, border: 'none', background: 'transparent' }}
              placeholder="Note Title..."
            />
          ) : (
            <div style={{ flex: 1 }}>Select or create a note</div>
          )}
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {activeNote && (
              <div className="save-status">
                {saveStatus === 'saving' && <><RefreshCcw size={14} className="animate-spin" /> Saving...</>}
                {saveStatus === 'saved' && <><CheckCircle size={14} color="var(--accent-color)" /> Saved</>}
                {saveStatus === 'error' && <><RefreshCcw size={14} color="var(--danger-color)" /> Error</>}
              </div>
            )}
            
            <button onClick={toggleTheme} className="btn-icon">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {activeNote && (
              <button onClick={handleDeleteNote} className="btn-icon delete-btn" title="Delete Note">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>

        {activeNoteId ? (
          <div className="workspace">
            <Editor content={editContent} onChange={setEditContent} />
            <Preview content={editContent} />
          </div>
        ) : (
          <div className="workspace" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--text-tertiary)' }}>
            <p>Select a note from the sidebar to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
