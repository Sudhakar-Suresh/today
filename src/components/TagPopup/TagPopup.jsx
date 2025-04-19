import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faArrowLeft, faCheck, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import EditTagPopup from './EditTagPopup';
import "./TagPopup.css";

const TagPopup = ({ tags, setTags, selectedTags, setSelectedTags, closePopup, saveTags, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [localTags, setLocalTags] = useState(tags);
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags);

  const colorOptions = [
    "#FF4D4D", "#FF804D", "#FFC24D", "#FFD84D", "#57CC57",
    "#45D6B6", "#45AFFF", "#3273FF", "#1F3CFF", "#AB47BC",
    "#D32F2F", "#E91E63", "#F06292", "#9E9E9E"
  ];

  const handleTagToggle = (tag) => {
    const isSelected = localSelectedTags.some(t => t.name === tag.name);
    let updatedSelectedTags;

    if (isSelected) {
      updatedSelectedTags = localSelectedTags.filter(t => t.name !== tag.name);
    } else {
      updatedSelectedTags = [...localSelectedTags, tag];
    }

    setLocalSelectedTags(updatedSelectedTags);
  };

  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setShowEditPopup(true);
  };

  const handleUpdateTag = (oldTag, updatedTag) => {
    const updatedTags = localTags.map(tag => 
      tag.name === oldTag.name ? updatedTag : tag
    );
    setLocalTags(updatedTags);

    // Update selected tags if the edited tag was selected
    const updatedSelectedTags = localSelectedTags.map(tag =>
      tag.name === oldTag.name ? updatedTag : tag
    );
    setLocalSelectedTags(updatedSelectedTags);

    setShowEditPopup(false);
  };

  const handleDeleteTag = (tagToDelete) => {
    setLocalTags(localTags.filter(tag => tag.name !== tagToDelete.name));
    setLocalSelectedTags(localSelectedTags.filter(tag => tag.name !== tagToDelete.name));
  };

  const handleCreateTag = (newTag) => {
    setLocalTags([...localTags, newTag]);
    setLocalSelectedTags([...localSelectedTags, newTag]);
    setShowEditPopup(false);
  };

  const handleSave = () => {
    setTags(localSelectedTags);
    saveTags(localTags, localSelectedTags);
    closePopup();
  };

  const filteredTags = localTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update the click handler to prevent propagation
  const handlePopupClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="tags-popup" onClick={handlePopupClick}>
      <div className="tags-header">
        <h3>Tags</h3>
        <div className="header-actions">
          <button 
            className="add-tag-btn"
            onClick={(e) => {
              e.stopPropagation();
              setEditingTag(null);
              setShowEditPopup(true);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="close-btn" onClick={closePopup}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>

      <div className="tags-search">
        <input
          type="text"
          placeholder="Search tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="tags-list">
        {filteredTags.map((tag) => (
          <div key={tag.name} className="tag-item">
            <div className="tag-item-left">
              <input
                type="checkbox"
                checked={localSelectedTags.some(t => t.name === tag.name)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleTagToggle(tag);
                }}
              />
              <span 
                className="tag-color"
                style={{ backgroundColor: tag.color }}
              ></span>
              <span className="tag-name">{tag.name}</span>
            </div>
            <div className="tag-item-actions">
              <button 
                className="edit-tag-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTag(tag);
                }}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="tags-footer">
        <button className="cancel-btn" onClick={closePopup}>Cancel</button>
        <button className="save-btn" onClick={handleSave}>Save</button>
      </div>

      {showEditPopup && (
        <EditTagPopup
          tag={editingTag}
          onSave={editingTag ? handleUpdateTag : handleCreateTag}
          onDelete={handleDeleteTag}
          onClose={() => setShowEditPopup(false)}
        />
      )}
    </div>
  );
};

export default TagPopup;
