const db = require('../db');

exports.getAllNotes = (req, res) => {
    const { search } = req.query;
    let query = 'SELECT * FROM notes ORDER BY updatedAt DESC';
    let params = [];

    if (search) {
        query = 'SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updatedAt DESC';
        params = [`%${search}%`, `%${search}%`];
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
};

exports.getNoteById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.json(row);
    });
};

exports.createNote = (req, res) => {
    const { title, content } = req.body;
    
    // Auto-create title if empty or use first line logic if useful, but basic requirement just expects title and content.
    const noteTitle = title || 'Untitled Note';
    const noteContent = content || '';

    const query = 'INSERT INTO notes (title, content, createdAt, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)';
    db.run(query, [noteTitle, noteContent], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        // Return the newly created note
        db.get('SELECT * FROM notes WHERE id = ?', [this.lastID], (err, row) => {
            res.status(201).json(row);
        });
    });
};

exports.updateNote = (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    const query = 'UPDATE notes SET title = ?, content = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?';
    db.run(query, [title, content, id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        
        db.get('SELECT * FROM notes WHERE id = ?', [id], (err, row) => {
            res.json(row);
        });
    });
};

exports.deleteNote = (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM notes WHERE id = ?';
    db.run(query, [id], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Note not found' });
        }
        res.status(204).send(); // No content to send back
    });
};
