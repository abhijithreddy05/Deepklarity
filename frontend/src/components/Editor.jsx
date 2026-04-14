import React from 'react';

const Editor = ({ content, onChange }) => {
  return (
    <div className="editor-pane">
      <textarea
        className="editor-textarea"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type some markdown here... Use # for headers, **text** for bold, etc."
      />
    </div>
  );
};

export default Editor;
