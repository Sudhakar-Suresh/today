import React, { useState } from 'react';
import Portal from '../Portal';
import './EditTagPopup.css';

const EditTagPopup = ({ tag, onSave, onDelete, onClose }) => {
  const [tagName, setTagName] = useState(tag ? tag.name : '');
  const [selectedColor, setSelectedColor] = useState(tag ? tag.color : '#03A9F4');

  const colors = [
    '#FF4D4D', // Red
    '#FF7E45', // Orange
    '#FFBD36', // Amber
    '#FFEB3B', // Yellow
    '#4CAF50', // Green
    
    '#8BC34A', // Light Green
    '#00BCD4', // Teal
    '#03A9F4', // Light Blue
    '#2196F3', // Blue
    '#3F51B5', // Indigo
    
    '#9C27B0', // Purple
    '#C62828', // Dark Red
    '#E91E63', // Pink
    '#F48FB1', // Light Pink
    '#9E9E9E', // Grey
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
    <Portal>
      <div className="edit-tag-overlay" onClick={onClose}>
        <div className="edit-tag-popup" onClick={(e) => e.stopPropagation()}>
          <div className="edit-tag-header">
            <button className="back-btn" onClick={onClose}>
              ←
            </button>
            <span>{tag ? 'Edit Tag' : 'New Tag'}</span>
            <button 
              className="save-tag-btn"
              onClick={handleSave}
              disabled={!tagName.trim()}
            >
              SAVE
            </button>
          </div>

          <div className="edit-tag-content">
            <div className="tag-name-section">
              <label>TAG NAME</label>
              <input
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                placeholder="Type a name"
                autoFocus
              />
            </div>

            <div className="color-section">
              <label>COLOR</label>
              <div className="color-grid">
                {colors.map((color, index) => (
                  <button
                    key={index}
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && '✓'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default EditTagPopup; 