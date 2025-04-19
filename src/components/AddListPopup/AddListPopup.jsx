import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './AddListPopup.css';

const AddListPopup = ({ onClose, onAdd }) => {
  const [listTitle, setListTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listTitle.trim()) {
      onAdd(listTitle.trim());
      onClose();
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <div className="popup-header">
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="list-title-input"
            value={listTitle}
            onChange={(e) => setListTitle(e.target.value)}
            placeholder="Add a list title"
            autoFocus
          />
          <div className="popup-actions">
            <button 
              type="submit" 
              className="continue-btn"
              disabled={!listTitle.trim()}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddListPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired
};

export default AddListPopup; 