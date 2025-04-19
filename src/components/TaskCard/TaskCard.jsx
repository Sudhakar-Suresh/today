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
import TaskDetailPopup from "../TaskDetailPopup/TaskDetailPopup";
import "./TaskCard.css";

const TaskCard = ({ 
  task, 
  onDelete, 
  onUpdateTags, 
  onUpdateList, 
  onToggleComplete, 
  onUpdateReminder, 
  onTogglePin, 
  onUpdateTitle,
  onUpdateNotes,
  onUpdateSubtasks,
  onAddAttachment,
  availableLists = [] 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showReminderTooltip, setShowReminderTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
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
  const [reminder, setReminder] = useState(task.reminder || null);
  const [isPinned, setIsPinned] = useState(task.pinned || false);

  // Use a default list if no lists are provided
  const defaultLists = ["Personal", "Work", "Shopping", "Ideas"];
  const listsToUse = availableLists && availableLists.length > 0 ? availableLists : defaultLists;
  
  const menuRef = useRef(null);
  const popupRef = useRef(null);
  const reminderRef = useRef(null);
  const cardRef = useRef(null);

  // Function to handle card click with better filtering
  const handleCardClick = (e) => {
    // If any popup is already open, don't open the detail popup
    if (showMenu || showReminderPopup || listPopupOpen || tagsPopupOpen) {
      return;
    }
    
    // Check for clicks on interactive elements that should not open the detail popup
    const isActionButton = e.target.closest('.task-action-btn');
    const isCheckbox = e.target.closest('.task-checkbox');
    const isTagDelete = e.target.closest('.tag-delete-icon');
    const isTaskReminder = e.target.closest('.task-reminder');
    const isTaskTag = e.target.closest('.task-tag') || e.target.closest('.tag-wrapper');
    const isMenu = e.target.closest('.task-menu');
    const isMenuButton = e.target.closest('.more-btn');
    
    // If none of these elements were clicked, open the detail popup
    if (!isActionButton && !isCheckbox && !isTagDelete && !isTaskReminder && 
        !isTaskTag && !isMenu && !isMenuButton) {
      setShowDetailPopup(true);
    }
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation(); // Prevent opening the detail popup
    if (onToggleComplete) {
      onToggleComplete(task.id, !task.completed);
    }
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
    // Close other popups
    setShowDetailPopup(false);
    setShowReminderPopup(false);
    setListPopupOpen(false);
    setTagsPopupOpen(false);
  };

  const handleMenuClose = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleMenuClose);
    } else {
      document.removeEventListener('mousedown', handleMenuClose);
    }
    return () => {
      document.removeEventListener('mousedown', handleMenuClose);
    };
  }, [showMenu]);

  const handlePinClick = (e) => {
    e.stopPropagation();
    if (onTogglePin) {
      onTogglePin(task.id, !isPinned);
    }
    setIsPinned(!isPinned);
    setShowMenu(false);
  };

  const handleReminderClick = (e) => {
    e.stopPropagation(); // Prevent card click from opening detail popup
    setShowReminderPopup(true);
    setShowMenu(false);
    setShowDetailPopup(false);
    setListPopupOpen(false);
    setTagsPopupOpen(false);
  };

  const handleReminderIconClick = (e) => {
    e.stopPropagation(); // Prevent card click from opening detail popup
    setShowReminderPopup(true);
    setShowDetailPopup(false);
    setListPopupOpen(false);
    setTagsPopupOpen(false);
    setShowMenu(false);
  };

  const handleSetReminder = (reminderData) => {
    if (onUpdateReminder) {
      onUpdateReminder(task.id, reminderData);
    }
    setReminder(reminderData);
    setShowReminderPopup(false);
  };

  const handleListClick = (e) => {
    e.stopPropagation(); // Prevent card click from opening detail popup
    setListPopupOpen(true);
    setShowMenu(false);
    setShowDetailPopup(false);
    setShowReminderPopup(false);
    setTagsPopupOpen(false);
  };

  const handleListSelection = (listName) => {
    setSelectedList(listName);
    if (onUpdateList) {
      onUpdateList(task.id, listName);
    }
    setListPopupOpen(false);
  };

  const handleTagsClick = (e) => {
    e.stopPropagation(); // Prevent card click from opening detail popup
    setTagsPopupOpen(true);
    setShowMenu(false);
    setShowDetailPopup(false);
    setShowReminderPopup(false);
    setListPopupOpen(false);
  };

  const handleTagClick = (e) => {
    e.stopPropagation(); // Prevent card click from opening detail popup
    setTagsPopupOpen(true);
    setShowDetailPopup(false);
    setShowReminderPopup(false);
    setListPopupOpen(false);
    setShowMenu(false);
  };

  const handleSaveTags = (updatedTags, updatedSelectedTags) => {
    setTags(updatedTags);
    setSelectedTags(updatedSelectedTags);
    
    if (onUpdateTags) {
      onUpdateTags(task.id, updatedSelectedTags);
    }
  };

  // Format reminder date for display
  const formatReminderDate = (reminderData) => {
    if (!reminderData) return null;
    
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const reminderDate = new Date(reminderData.fullDate);
    
    // If it's today
    if (reminderDate.toDateString() === now.toDateString()) {
      return `Today, ${reminderData.time}`;
    }
    
    // If it's tomorrow
    if (reminderDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow, ${reminderData.time}`;
    }
    
    // Otherwise show date and time
    const options = { month: 'short', day: 'numeric' };
    return `${reminderDate.toLocaleDateString('en-US', options)}, ${reminderData.time}`;
  };

  // Get a more detailed reminder date for the tooltip
  const getReminderTooltipDate = (reminderData) => {
    if (!reminderData) return null;
    
    const reminderDate = new Date(reminderData.fullDate);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return `${reminderDate.toLocaleDateString('en-US', options)} at ${reminderData.time}`;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  // Close detail popup
  const handleCloseDetailPopup = () => {
    setShowDetailPopup(false);
  };

  // Handle updating task title from detail popup
  const handleUpdateTaskTitle = (taskId, newTitle) => {
    if (onUpdateTitle) {
      onUpdateTitle(taskId, newTitle);
    }
  };

  // Handle updating task notes from detail popup
  const handleUpdateTaskNotes = (taskId, newNotes) => {
    if (onUpdateNotes) {
      onUpdateNotes(taskId, newNotes);
    }
  };

  // Handle updating subtasks from detail popup
  const handleUpdateTaskSubtasks = (taskId, newSubtasks) => {
    if (onUpdateSubtasks) {
      onUpdateSubtasks(taskId, newSubtasks);
    }
  };

  // Handle adding attachments from detail popup
  const handleAddTaskAttachment = (taskId, attachment) => {
    if (onAddAttachment) {
      onAddAttachment(taskId, attachment);
    }
  };

  // Update component state when props change
  useEffect(() => {
    setSelectedTags(task.tags || []);
    setSelectedList(task.list || "Personal");
    setReminder(task.reminder || null);
    setIsPinned(task.pinned || false);
  }, [task]);

  return (
    <>
      <div 
        ref={cardRef}
        className={`task-card ${task.completed ? 'completed' : ''} ${isPinned ? 'pinned' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        <div className="task-content">
          <div className="task-left">
            <div 
              className={`task-checkbox ${task.completed ? 'completed' : ''}`}
              onClick={handleCheckboxClick}
            ></div>
            
            <div className="task-info">
              <div className="task-list-path">
                <span>My lists › {selectedList}</span>
              </div>
              <div className={`task-title ${task.completed ? 'completed-text' : ''}`}>
                {task.title}
              </div>
            </div>
          </div>

          {reminder && isHovered && (
            <div 
              className="task-reminder"
              ref={reminderRef}
              onClick={handleReminderIconClick}
              onMouseEnter={() => setShowReminderTooltip(true)}
              onMouseLeave={() => setShowReminderTooltip(false)}
            >
              <FontAwesomeIcon icon={faBell} className="reminder-icon" />
              <span className="reminder-text">{formatReminderDate(reminder)}</span>
              
              {showReminderTooltip && (
                <div className="reminder-tooltip">
                  <div className="tooltip-header">Reminder</div>
                  <div className="tooltip-content">{getReminderTooltipDate(reminder)}</div>
                </div>
              )}
            </div>
          )}

          {isHovered && selectedTags.length > 0 && (
            <div className="selected-tags">
              {selectedTags.map((tag, index) => (
                <div key={index} className="tag-wrapper" onClick={handleTagClick}>
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
                      const updatedTags = selectedTags.filter((_, i) => i !== index);
                      setSelectedTags(updatedTags);
                      if (onUpdateTags) {
                        onUpdateTags(task.id, updatedTags);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="task-actions">
          {isHovered && (
            <>
              <button 
                className="task-action-btn pin-btn" 
                onClick={handlePinClick}
                title={isPinned ? "Unpin" : "Pin"}
              >
                <FontAwesomeIcon 
                  icon={faThumbtack} 
                  className={`icon ${isPinned ? 'pinned' : ''}`} 
                />
              </button>
              <button className="task-action-btn more-btn" onClick={handleMoreClick} title="More options">
                <FontAwesomeIcon 
                  icon={faEllipsisVertical} 
                  className="icon" 
                />
              </button>
              <button className="task-action-btn close-btn" onClick={handleDelete} title="Delete">
                <FontAwesomeIcon 
                  icon={faXmark} 
                  className="icon" 
                />
              </button>
            </>
          )}
        </div>

        {showMenu && (
          <div className="task-menu" ref={menuRef}>
            <button className="task-menu-item" onClick={handleReminderClick}>
              <FontAwesomeIcon icon={faBell} className="menu-icon" /> 
              <span>Reminder</span>
            </button>
            <button className="task-menu-item" onClick={handleListClick}>
              <FontAwesomeIcon icon={faList} className="menu-icon" /> 
              <span>Lists</span>
            </button>
            <button className="task-menu-item" onClick={handleTagsClick}>
              <FontAwesomeIcon icon={faHashtag} className="menu-icon" /> 
              <span>Tags</span>
            </button>
            <button className="task-menu-item" onClick={handlePinClick}>
              <FontAwesomeIcon icon={faThumbtack} className="menu-icon" /> 
              <span>Pin</span>
            </button>
          </div>
        )}

        {showReminderPopup && (
          <ReminderPopup 
            onClose={() => setShowReminderPopup(false)}
            onSetReminder={handleSetReminder}
            initialDate={reminder}
          />
        )}

        {listPopupOpen && (
          <ListEditPopup
            lists={listsToUse}
            selectedList={selectedList}
            onClose={() => setListPopupOpen(false)}
            onEdit={handleListSelection}
          />
        )}

        {tagsPopupOpen && (
          <>
            <div className="tag-popup-overlay" onClick={() => setTagsPopupOpen(false)}></div>
            <div className="tag-popup-container">
              <TagPopup
                tags={tags}
                setTags={setTags}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                closePopup={() => setTagsPopupOpen(false)}
                saveTags={handleSaveTags}
                onDelete={(tag) => {
                  const updatedTags = tags.filter(t => t.name !== tag.name);
                  const updatedSelectedTags = selectedTags.filter(t => t.name !== tag.name);
                  setTags(updatedTags);
                  setSelectedTags(updatedSelectedTags);
                  if (onUpdateTags) {
                    onUpdateTags(task.id, updatedSelectedTags);
                  }
                }}
              />
            </div>
          </>
        )}
      </div>

      {showDetailPopup && (
        <TaskDetailPopup
          task={{
            ...task,
            list: selectedList,
            tags: selectedTags,
            reminder: reminder,
            pinned: isPinned,
            subtasks: task.subtasks || []
          }}
          onClose={handleCloseDetailPopup}
          onUpdateTitle={handleUpdateTaskTitle}
          onUpdateNotes={handleUpdateTaskNotes}
          onToggleComplete={onToggleComplete}
          onUpdateList={onUpdateList}
          onUpdateReminder={onUpdateReminder}
          onUpdateTags={onUpdateTags}
          onUpdateSubtasks={handleUpdateTaskSubtasks}
          onAddAttachment={handleAddTaskAttachment}
        />
      )}
    </>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    notes: PropTypes.string,
    list: PropTypes.string,
    tags: PropTypes.array,
    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string.isRequired,
        completed: PropTypes.bool.isRequired
      })
    ),
    reminder: PropTypes.object,
    completed: PropTypes.bool,
    pinned: PropTypes.bool,
    attachments: PropTypes.array
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateTags: PropTypes.func,
  onUpdateList: PropTypes.func,
  onToggleComplete: PropTypes.func.isRequired,
  onUpdateReminder: PropTypes.func,
  onTogglePin: PropTypes.func,
  onUpdateTitle: PropTypes.func,
  onUpdateNotes: PropTypes.func,
  onUpdateSubtasks: PropTypes.func,
  onAddAttachment: PropTypes.func,
  availableLists: PropTypes.arrayOf(PropTypes.string)
};

export default TaskCard;