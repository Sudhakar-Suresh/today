import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTimes,
  faThumbtack,
  faBell,
  faList,
  faHashtag,
  faMapPin,
  faTrash,  // Add this import
} from "@fortawesome/free-solid-svg-icons";
import TagPopup from "../TagPopup/TagPopup";
import EditTagPopup from "../EditTagPopup/EditTagPopup";
import "./TaskCard.css";

const TaskCard = ({ task, onDelete, onUpdateTags }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tagsPopupOpen, setTagsPopupOpen] = useState(false);
  const [tags, setTags] = useState([
    { name: "Priority", color: "#FFD84D" },
    { name: "sdfz", color: "#57CC57" },
  ]);
  const [selectedTags, setSelectedTags] = useState(task.tags || []);
  const [editTagPopupOpen, setEditTagPopupOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);

  const menuRef = useRef(null);
  const tagsPopupRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const openTagsPopup = () => setTagsPopupOpen(true);
  const closePopups = () => {
    setMenuOpen(false);
    setTagsPopupOpen(false);
    setEditTagPopupOpen(false);
  };

  const handleEditTag = (tag, e) => {
    e.stopPropagation();
    setEditingTag(tag);
    setEditTagPopupOpen(true);
  };

  const handleEditTagSave = (updatedTag) => {
    const updatedTags = tags.map((t) =>
      t.name === editingTag.name ? updatedTag : t
    );
    setTags(updatedTags);
    setEditTagPopupOpen(false);
    setEditingTag(null);
  };

  const handleDeleteTag = (tagToDelete) => {
    const updatedTags = tags.filter(t => t.name !== tagToDelete.name);
    const updatedSelectedTags = selectedTags.filter(t => t.name !== tagToDelete.name);
    setTags(updatedTags);
    setSelectedTags(updatedSelectedTags);
    setEditTagPopupOpen(false);
    setEditingTag(null);
  };

  // Handle saving tags from TagPopup
  const handleSaveTags = (updatedTags, updatedSelectedTags) => {
    if (onUpdateTags) {
      onUpdateTags(task.id, updatedSelectedTags);
    }
    setTags(updatedTags);
    setSelectedTags(updatedSelectedTags);
    closePopups();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target) && !tagsPopupRef.current?.contains(event.target)) {
        closePopups();
      }
    };

    if (menuOpen || tagsPopupOpen || editTagPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen, tagsPopupOpen, editTagPopupOpen]);

  return (
    <div className="task-card" style={{ position: 'relative' }}>
      <div className="task-content">
        <span className="task-category">🔒 My lists &gt; Personal</span>
        <p>{task.title}</p>
        
        {/* Display selected tags on the task card */}
        <div className="selected-tags">
          {selectedTags.map((tag, index) => (
            <div key={index} className="tag-wrapper">
              <span
                className="task-tag"
                style={{ backgroundColor: tag.color }}
                onClick={(e) => handleEditTag(tag, e)}
              >
                {tag.name}
              </span>
              <FontAwesomeIcon
                icon={faTrash}
                className="tag-delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTag(tag);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="task-actions">
        <FontAwesomeIcon icon={faThumbtack} className="icon" />
        <FontAwesomeIcon icon={faEllipsisV} className="icon" onClick={toggleMenu} />
        <FontAwesomeIcon icon={faTimes} className="icon" onClick={() => onDelete(task.id)} />
      </div>

      {/* Task Menu Popup */}
      {menuOpen && (
        <div className="task-menu" ref={menuRef}>
          <div className="menu-item">
            <FontAwesomeIcon icon={faBell} className="menu-icon" /> Reminder
          </div>
          <div className="menu-item">
            <FontAwesomeIcon icon={faList} className="menu-icon" /> Lists
          </div>
          <div className="menu-item" onClick={openTagsPopup}>
            <FontAwesomeIcon icon={faHashtag} className="menu-icon" /> Tags
          </div>
          <div className="menu-item">
            <FontAwesomeIcon icon={faMapPin} className="menu-icon" /> Pin
          </div>
        </div>
      )}

      {/* Tags Popup */}
      {tagsPopupOpen && (
        <div ref={tagsPopupRef} className="tags-popup-container">
          <TagPopup
            tags={tags}
            setTags={setTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            closePopup={closePopups}
            saveTags={handleSaveTags}
            onEditTag={handleEditTag}
            onDelete={handleDeleteTag}  // Add this line
            editTagPopupOpen={editTagPopupOpen}
            setEditTagPopupOpen={setEditTagPopupOpen}
            editingTag={editingTag}
          />
        </div>
      )}

      {editTagPopupOpen && editingTag && (
        <EditTagPopup
          tag={editingTag}
          onSave={handleEditTagSave}
          onDelete={handleDeleteTag}
          onClose={() => {
            setEditTagPopupOpen(false);
            setEditingTag(null);
          }}
        />
      )}
    </div>
  );
};

export default TaskCard;
