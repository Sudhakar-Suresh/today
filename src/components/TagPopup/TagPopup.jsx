import React, { useState } from "react";
import EditTagPopup from './EditTagPopup';
import "./TagPopup.css";

const TagPopup = ({ tags, setTags, selectedTags, setSelectedTags, closePopup, saveTags }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localSelectedTags, setLocalSelectedTags] = useState(selectedTags || []);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [localTags, setLocalTags] = useState(tags || []);

  // Toggle tag selection
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

  // Edit tag functionality
  const handleEditTag = (tag) => {
    setEditingTag(tag);
    setShowEditPopup(true);
  };

  const handleUpdateTag = (oldTag, updatedTag) => {
    // Update in all tags list
    const updatedTags = localTags.map(tag => 
      tag.name === oldTag.name ? updatedTag : tag
    );
    setLocalTags(updatedTags);

    // Update in selected tags if needed
    const updatedSelectedTags = localSelectedTags.map(tag =>
      tag.name === oldTag.name ? updatedTag : tag
    );
    setLocalSelectedTags(updatedSelectedTags);

    setShowEditPopup(false);
  };

  // Create new tag
  const handleAddTag = () => {
    setEditingTag(null);
    setShowEditPopup(true);
  };

  const handleCreateTag = (newTag) => {
    setLocalTags([...localTags, newTag]);
    setLocalSelectedTags([...localSelectedTags, newTag]);
    setShowEditPopup(false);
  };

  // Delete tag
  const handleDeleteTag = (tagToDelete) => {
    setLocalTags(localTags.filter(tag => tag.name !== tagToDelete.name));
    setLocalSelectedTags(localSelectedTags.filter(tag => tag.name !== tagToDelete.name));
  };

  // Save changes
  const handleSave = () => {
    setSelectedTags(localSelectedTags);
    if (saveTags) {
      saveTags(localTags, localSelectedTags);
    }
    closePopup();
  };

  // Filter tags based on search
  const filteredTags = localTags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="tag-popup-overlay" onClick={closePopup}>
      <div className="tag-popup" onClick={(e) => e.stopPropagation()}>
        <div className="tag-popup-header">
          <span>Tags</span>
          <button className="add-tag-btn" onClick={handleAddTag}>+</button>
        </div>
        
        <div className="tag-popup-search">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search tags"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="tag-popup-list">
          {filteredTags.map((tag) => (
            <div key={tag.name} className="tag-item">
              <label className="tag-checkbox">
                <input
                  type="checkbox"
                  checked={localSelectedTags.some(t => t.name === tag.name)}
                  onChange={() => handleTagToggle(tag)}
                />
                <span className="checkmark"></span>
              </label>
              <div 
                className="tag-label"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </div>
              {tag.name !== "Priority" && (
                <button 
                  className="edit-tag-btn" 
                  onClick={() => handleEditTag(tag)}
                >
                  ✏️
                </button>
              )}
            </div>
          ))}
        </div>
        
        <div className="tag-popup-footer">
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
    </div>
  );
};

export default TagPopup;
