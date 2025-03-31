import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faArrowLeft, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./TagPopup.css";

const TagPopup = ({ tags, setTags, selectedTags, setSelectedTags, closePopup, saveTags, onDelete }) => {
  const [tagName, setTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSelectedTags, setTempSelectedTags] = useState(selectedTags);

  const colorOptions = [
    "#FF4D4D", "#FF804D", "#FFC24D", "#FFD84D", "#57CC57",
    "#45D6B6", "#45AFFF", "#3273FF", "#1F3CFF", "#AB47BC",
    "#D32F2F", "#E91E63", "#F06292", "#9E9E9E"
  ];

  // Open "New Tag" popup
  const openNewTagPopup = () => {
    setTagName("");
    setSelectedColor("");
    setEditingIndex(null);
    setIsEditing(true);
  };

  // Open "Edit Tag" popup
  const startEditing = (index) => {
    const tagToEdit = tags[index];
    if (tagToEdit) {
      setTagName(tagToEdit.name);
      setSelectedColor(tagToEdit.color);
      setEditingIndex(index);
      setIsEditing(true);
    }
  };

  // Save new or edited tag
  const saveTag = () => {
    if (!tagName.trim() || !selectedColor) return;

    const newTag = { name: tagName.trim(), color: selectedColor };
    let updatedTags = [...tags];

    if (editingIndex !== null) {
      updatedTags[editingIndex] = newTag;
      setTempSelectedTags(prevSelectedTags => 
        prevSelectedTags.map(tag => 
          tag.name === tags[editingIndex].name ? newTag : tag
        )
      );
    } else {
      updatedTags.push(newTag);
      setTempSelectedTags(prev => [...prev, newTag]);
    }

    setTags(updatedTags);
    setIsEditing(false);
    setEditingIndex(null);
  };

  const toggleTagSelection = (tag) => {
    setTempSelectedTags((prevSelectedTags) =>
      prevSelectedTags.some((t) => t.name === tag.name)
        ? prevSelectedTags.filter((t) => t.name !== tag.name)
        : [...prevSelectedTags, tag]
    );
  };

  const handleSave = () => {
    setSelectedTags(tempSelectedTags);
    saveTags(tags, tempSelectedTags);
    closePopup();
  };

  return (
    <div className="tags-popup">
      {!isEditing ? (
        <>
          <div className="tags-header">
            <span>Tags</span>
            <FontAwesomeIcon icon={faPlus} className="add-tag-icon" onClick={openNewTagPopup} />
          </div>
          <div className="tags-list">
            {tags.map((tag, index) => (
              <div key={index} className="tag-item" style={{ backgroundColor: tag.color }}>
                <div className="tag-info">
                  <input
                    type="checkbox"
                    checked={tempSelectedTags.some((t) => t.name === tag.name)}
                    onChange={() => toggleTagSelection(tag)}
                  />
                  <span>{tag.name}</span>
                </div>
                <div className="tag-actions">
                  <FontAwesomeIcon 
                    icon={faEdit} 
                    className="edit-icon" 
                    onClick={() => startEditing(index)} 
                  />
                  <FontAwesomeIcon 
                    icon={faTrash} 
                    className="delete-icon" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(tag);
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="tags-footer">
            <button className="cancel-btn" onClick={closePopup}>Cancel</button>
            <button className="save-btn" onClick={handleSave}>Save</button>
          </div>
        </>
      ) : (
        <div className="new-tag-popup">
          <div className="new-tag-header">
            <FontAwesomeIcon icon={faArrowLeft} className="back-icon" onClick={() => setIsEditing(false)} />
            <span>{editingIndex !== null ? "Edit Tag" : "New Tag"}</span>
            <button className="save-btn" disabled={!tagName || !selectedColor} onClick={saveTag}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          </div>
          <div className="new-tag-body">
            <label>TAG NAME</label>
            <input
              type="text"
              placeholder="Type a name"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
            />
            <label>COLOR</label>
            <div className="color-picker">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  className={`color-circle ${selectedColor === color ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setSelectedColor(color)}
                >
                  {selectedColor === color && <span className="checkmark">✔</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagPopup;
