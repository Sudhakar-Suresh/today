import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisVertical,
  faTimes,
  faBell,
  faList,
  faHashtag,
  faThumbtack,
  faCheck,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import ListEditPopup from "../ListEditPopup/ListEditPopup";
import TagPopup from "../TagPopup/TagPopup";
import ReminderPopup from "../ReminderPopup/ReminderPopup";
import "./TaskCard.css";

const TaskCard = ({ task, onDelete, onUpdateTags, onUpdateList, onToggleComplete, onUpdateReminder, onTogglePin, availableLists = [] }) => {
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
  const [selectedList, setSelectedList] = useState(task.list || "Personal");
  const [reminderPopupOpen, setReminderPopupOpen] = useState(false);
  const [reminder, setReminder] = useState(task.reminder || null);
  const [isPinned, setIsPinned] = useState(task.pinned || false);

  // Use a default list if no lists are provided
  const defaultLists = ["Personal", "Work", "Shopping", "Ideas"];
  const listsToUse = availableLists && availableLists.length > 0 ? availableLists : defaultLists;
  
  console.log("TaskCard availableLists:", availableLists);
  console.log("TaskCard listsToUse:", listsToUse);

  const menuRef = useRef(null);
  const popupRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };
  
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
    console.log("TaskCard - updating list from", selectedList, "to:", newListName);
    
    if (newListName && newListName.trim() !== '') {
      setSelectedList(newListName);
      
      if (onUpdateList) {
        console.log("TaskCard - calling onUpdateList with:", task.id, newListName);
        onUpdateList(task.id, newListName);
      }
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
    setReminderPopupOpen(false);
    
    if (onUpdateReminder) {
      onUpdateReminder(taskId, reminderData);
    } else {
      console.log(`Reminder set for task ${taskId} at ${reminderData.date} ${reminderData.time}`);
    }
  };

  const handleClearReminder = (e) => {
    e.stopPropagation();
    setReminder(null);
    
    if (onUpdateReminder) {
      onUpdateReminder(task.id, null);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onToggleComplete(task.id, !task.completed);
  };
  
  const handleTogglePin = (e) => {
    if (e) e.stopPropagation();
    setIsPinned(!isPinned);
    
    if (onTogglePin) {
      onTogglePin(task.id, !isPinned);
    }
    
    setMenuOpen(false);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
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

  // Update component state when props change
  useEffect(() => {
    setSelectedTags(task.tags || []);
    setSelectedList(task.list || "Personal");
    setReminder(task.reminder || null);
    setIsPinned(task.pinned || false);
  }, [task]);

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} ${isPinned ? 'pinned' : ''}`}>
      <div className="task-content" onClick={() => console.log(`Task clicked: ${task.title}`)}>
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
              <span>My lists › {selectedList}</span>
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
            <button className="clear-reminder" onClick={handleClearReminder}>×</button>
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
                icon={faXmark}
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
        <button 
          className="icon-button pin-button" 
          onClick={handleTogglePin}
          title={isPinned ? "Unpin" : "Pin"}
        >
          <FontAwesomeIcon 
            icon={faThumbtack} 
            className={`icon ${isPinned ? 'pinned' : ''}`} 
          />
        </button>
        <button className="icon-button menu-button" onClick={toggleMenu} title="More options">
          <FontAwesomeIcon 
            icon={faEllipsisVertical} 
            className="icon" 
          />
        </button>
        <button className="icon-button close-button" onClick={handleDelete} title="Delete">
          <FontAwesomeIcon 
            icon={faXmark} 
            className="icon" 
          />
        </button>
      </div>

      {menuOpen && (
        <div className="task-menu popup-menu" ref={menuRef}>
          <div className="menu-item" onClick={openReminderPopup}>
            <FontAwesomeIcon icon={faBell} className="menu-icon" /> 
            <span>Reminder</span>
          </div>
          <div className="menu-item" onClick={openListPopup}>
            <FontAwesomeIcon icon={faList} className="menu-icon" /> 
            <span>Lists</span>
          </div>
          <div className="menu-item" onClick={openTagsPopup}>
            <FontAwesomeIcon icon={faHashtag} className="menu-icon" /> 
            <span>Tags</span>
          </div>
          <div className="menu-item" onClick={handleTogglePin}>
            <FontAwesomeIcon icon={faThumbtack} className="menu-icon" /> 
            <span>Pin</span>
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
            lists={listsToUse}
            selectedList={selectedList}
            onClose={() => setListPopupOpen(false)}
            onEdit={(newList) => {
              console.log(`TaskCard - Changing list from ${selectedList} to ${newList}`);
              handleListEdit(newList);
            }}
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
    reminder: PropTypes.object,
    completed: PropTypes.bool,
    pinned: PropTypes.bool
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateTags: PropTypes.func,
  onUpdateList: PropTypes.func,
  onToggleComplete: PropTypes.func.isRequired,
  onUpdateReminder: PropTypes.func,
  onTogglePin: PropTypes.func,
  availableLists: PropTypes.arrayOf(PropTypes.string)
};

export default TaskCard;