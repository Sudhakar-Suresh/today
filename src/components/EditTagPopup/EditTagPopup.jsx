import React, { useState } from 'react';

const EditTagPopup = ({ tag, onSave, onDelete, onClose }) => {
  const [tagName, setTagName] = useState(tag.name);
  const [tagColor, setTagColor] = useState(tag.color);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...tag, name: tagName, color: tagColor });
  };

  return (
    <div className="edit-tag-popup">
      <h3>Edit Tag</h3>
      <form onSubmit={handleSubmit} className="edit-tag-form">
        <input
          type="text"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
          placeholder="Tag name"
        />
        <input
          type="color"
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
        />
        <div className="edit-actions">
          <button type="button" className="delete-btn" onClick={() => onDelete(tag)}>
            Delete
          </button>
          <div className="right-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit">Save</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditTagPopup;
