import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import './EditTagPopup.css';

const EditTagPopup = ({ tag, onSave, onDelete, onClose }) => {
  const [tagName, setTagName] = useState(tag ? tag.name : '');
  const [selectedColor, setSelectedColor] = useState(tag ? tag.color : '#4285f4');

  const colors = [
    '#4285f4', // Blue
    '#34a853', // Green
    '#fbbc05', // Yellow
    '#ea4335', // Red
    '#ff7043', // Orange
    '#9c27b0', // Purple
    '#795548', // Brown
    '#607d8b', // Gray
  ];

  const handleSave = () => {
    if (tagName.trim()) {
      const updatedTag = {
        name: tagName.trim(),
        color: selectedColor
      };
      if (tag) {
        onSave(tag, updatedTag);
      } else {
        onSave(updatedTag);
      }
    }
  };

  return (
    <div className="edit-tag-popup">
      <div className="edit-tag-header">
        <h3>{tag ? 'Edit Tag' : 'New Tag'}</h3>
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      <div className="edit-tag-content">
        <div className="input-group">
          <label>Name</label>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
            autoFocus
          />
        </div>

        <div className="color-picker">
          <label>Color</label>
          <div className="color-options">
            {colors.map((color) => (
              <button
                key={color}
                className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="edit-tag-footer">
        {tag && (
          <button 
            className="delete-btn"
            onClick={() => {
              onDelete(tag);
              onClose();
            }}
          >
            <FontAwesomeIcon icon={faTrash} />
            Delete
          </button>
        )}
        <div className="right-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button 
            className="save-btn"
            onClick={handleSave}
            disabled={!tagName.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTagPopup; 