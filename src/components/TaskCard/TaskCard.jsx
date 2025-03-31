import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faTimes,
  faThumbtack,
  faBell,
  faList,
  faHashtag,
  faMapPin,
  faTrash,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import ListEditPopup from "../ListEditPopup/ListEditPopup";
import TagPopup from "../TagPopup/TagPopup";
import "./TaskCard.css";

const TaskCard = ({ task, onDelete, onUpdateTags, onUpdateList }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tags, setTags] = useState([
    { name: "Priority", color: "#FFD84D" },
    { name: "Work", color: "#57CC57" },
    { name: "Personal", color: "#4D8BF0" },
    { name: "Urgent", color: "#FF6B6B" },
  ]);
  const [selectedTags, setSelectedTags] = useState(task.tags || []);
  const [listPopupOpen, setListPopupOpen] = useState(false);
  const [tagsPopupOpen, setTagsPopupOpen] = useState(false);
  const [lists, setLists] = useState(["Personal", "Work", "Shopping", "Ideas"]);
  const [selectedList, setSelectedList] = useState(task.list || "Personal");

  const menuRef = useRef(null);
  const popupRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const openListPopup = () => {
    setMenuOpen(false);
    setListPopupOpen(true);
  };
  const openTagsPopup = () => {
    setMenuOpen(false);
    setTagsPopupOpen(true);
  };

  const closePopups = () => {
    setMenuOpen(false);
    setListPopupOpen(false);
    setTagsPopupOpen(false);
  };

  const handleListEdit = (newListName) => {
    setSelectedList(newListName);
    
    if (!lists.includes(newListName)) {
      setLists([...lists, newListName]);
    }

    if (onUpdateList) {
      onUpdateList(task.id, newListName);
    }

    setListPopupOpen(false);
  };

  const handleTagSelection = (tag) => {
    const isSelected = selectedTags.some(t => t.name === tag.name);
    let updatedTags;

    if (isSelected) {
      updatedTags = selectedTags.filter(t => t.name !== tag.name);
    } else {
      updatedTags = [...selectedTags, tag];
    }

    setSelectedTags(updatedTags);
    
    if (onUpdateTags) {
      onUpdateTags(task.id, updatedTags);
    }
  };

  const handleCreateTag = (newTag) => {
    setTags([...tags, newTag]);
    handleTagSelection(newTag);
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag.name !== tagToDelete.name));
    setSelectedTags(selectedTags.filter(tag => tag.name !== tagToDelete.name));
    
    if (onUpdateTags) {
      onUpdateTags(
        task.id,
        selectedTags.filter(tag => tag.name !== tagToDelete.name)
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        (!popupRef.current || !popupRef.current.contains(event.target))
      ) {
        closePopups();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="task-card">
      <div className="task-content">
        <div className="task-category">
          🔒 My lists &gt; {selectedList}
        </div>
        <p>{task.title}</p>

        <div className="selected-tags">
          {selectedTags.map((tag, index) => (
            <div key={index} className="tag-wrapper">
              <span
                className="task-tag"
                style={{ backgroundColor: tag.color }}
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
        <FontAwesomeIcon 
          icon={faEllipsisV} 
          className="icon" 
          onClick={toggleMenu} 
        />
        <FontAwesomeIcon 
          icon={faTimes} 
          className="icon" 
          onClick={() => onDelete(task.id)} 
        />
      </div>

      {menuOpen && (
        <div className="task-menu" ref={menuRef}>
          <div className="menu-item">
            <FontAwesomeIcon icon={faBell} className="menu-icon" /> Reminder
          </div>
          <div className="menu-item" onClick={openListPopup}>
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

      {listPopupOpen && (
        <div ref={popupRef}>
          <ListEditPopup
            lists={lists}
            selectedList={selectedList}
            onClose={() => setListPopupOpen(false)}
            onEdit={handleListEdit}
          />
        </div>
      )}

      {tagsPopupOpen && (
        <div className="tags-popup-container" ref={popupRef}>
          <TagPopup
            tags={tags}
            setTags={setTags}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
            closePopup={() => setTagsPopupOpen(false)}
            saveTags={(updatedTags, updatedSelectedTags) => {
              if (onUpdateTags) {
                onUpdateTags(task.id, updatedSelectedTags);
              }
              setTags(updatedTags);
              setSelectedTags(updatedSelectedTags);
              setTagsPopupOpen(false);
            }}
            onDelete={handleDeleteTag}
          />
        </div>
      )}
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    list: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateTags: PropTypes.func,
  onUpdateList: PropTypes.func,
};

export default TaskCard;