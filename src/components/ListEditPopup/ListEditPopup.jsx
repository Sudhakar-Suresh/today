import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ListEditPopup.css";

const ListEditPopup = ({ lists, selectedList, onClose, onEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [newListName, setNewListName] = useState("");

  const handleListClick = (list) => {
    if (editMode && editingList === list) return;
    
    if (list === selectedList) {
      setEditMode(true);
      setEditingList(list);
      setNewListName(list);
    } else {
      onEdit(list);
      onClose();
    }
  };

  const handleEdit = () => {
    if (newListName.trim() && newListName !== editingList) {
      onEdit(newListName);
    }
    setEditMode(false);
    setEditingList(null);
    onClose();
  };

  const handleInputChange = (e) => {
    setNewListName(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditMode(false);
      setEditingList(null);
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h4>Select or Edit List</h4>
        <ul className="popup-list">
          {lists.map((list, index) => (
            <li
              key={index}
              className={`popup-list-item ${selectedList === list ? "selected" : ""}`}
              onClick={() => handleListClick(list)}
            >
              {editMode && editingList === list ? (
                <input
                  type="text"
                  value={newListName}
                  onChange={handleInputChange}
                  onBlur={handleEdit}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              ) : (
                <div className="list-item-content">
                  <span>{list}</span>
                  {selectedList === list && <span className="checkmark">✓</span>}
                </div>
              )}
            </li>
          ))}
        </ul>
        <button className="popup-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

ListEditPopup.propTypes = {
  lists: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedList: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default ListEditPopup;