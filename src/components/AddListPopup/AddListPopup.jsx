import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './AddListPopup.css';

const AddListPopup = ({ onClose, onAdd }) => {
  const [listTitle, setListTitle] = useState('');
  const inputRef = useRef(null);
  
  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (listTitle.trim()) {
      onAdd(listTitle.trim());
      onClose();
    }
  };

  return (
    <div className="add-list-overlay" onClick={onClose}>
      <div className="add-list-popup" onClick={(e) => e.stopPropagation()}>
        <div className="add-list-header">
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              ref={inputRef}
              type="text"
              className="list-title-input"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              placeholder="Add a list title"
            />
          </div>
          <div className="add-list-actions">
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