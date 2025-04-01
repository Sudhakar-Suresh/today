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
import ReminderPopup from "../ReminderPopup/ReminderPopup";
import "./TaskCard.css";

const TaskCard = ({ task, onDelete, onUpdateTags, onUpdateList, onToggleComplete }) => {
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
  const [reminderPopupOpen, setReminderPopupOpen] = useState(false);
  const [reminder, setReminder] = useState(task.reminder || null);

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
  const openReminderPopup = () => {
    setMenuOpen(false);
    setReminderPopupOpen(true);
  };

  const closePopups = () => {
    setMenuOpen(false);
    setListPopupOpen(false);
    setTagsPopupOpen(false);
    setReminderPopupOpen(false);
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

  const handleSetReminder = (taskId, reminderData) => {
    setReminder(reminderData);
    
    // Here you would typically update this in your backend/storage
    console.log(`Reminder set for task ${taskId} at ${reminderData.date} ${reminderData.time}`);
    
    // You could implement a function in the parent component to save the reminder
    // if (onUpdateReminder) {
    //   onUpdateReminder(taskId, reminderData);
    // }
  };

  const handleCheckboxClick = () => {
    onToggleComplete(task.id, !task.completed);
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
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <div className="task-left">
          <div 
            className="checkbox-wrapper"
            onClick={handleCheckboxClick}
          >
            <div className={`custom-checkbox ${task.completed ? 'checked' : ''}`}>
              {task.completed && (
                <FontAwesomeIcon 
                  icon={faCheck} 
                  className="check-icon"
                />
              )}
            </div>
          </div>
          
          <div className="task-info">
            <div className="task-list-path">
              <span>My lists › {task.list}</span>
            </div>
            <div className={`task-title ${task.completed ? 'completed-text' : ''}`}>
              {task.title}
            </div>
          </div>
        </div>

        {reminder && (
          <div className="task-reminder">
            <FontAwesomeIcon icon={faBell} className="reminder-icon" />
            <span>{reminder.date} {reminder.time}</span>
          </div>
        )}

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
          <div className="menu-item" onClick={openReminderPopup}>
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

      {reminderPopupOpen && (
        <div ref={popupRef}>
          <ReminderPopup
            onClose={() => setReminderPopupOpen(false)}
            onSetReminder={handleSetReminder}
            task={task}
          />
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
            }}
          />
        </div>
      )}
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    list: PropTypes.string,
    tags: PropTypes.array,
    reminder: PropTypes.object
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateTags: PropTypes.func,
  onUpdateList: PropTypes.func,
  onToggleComplete: PropTypes.func.isRequired
};

export default TaskCard;