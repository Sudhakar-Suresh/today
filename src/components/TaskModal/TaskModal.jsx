import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTags,
  faPlus,
  faTag,
  faXmark
} from "@fortawesome/free-solid-svg-icons";
import ListEditPopup from '../ListEditPopup/ListEditPopup';
import TagPopup from '../TagPopup/TagPopup';
import './TaskModal.css';

const TaskModal = ({ onClose, onSave, initialDate, availableLists = ['Personal', 'Work', 'Shopping', 'Ideas'] }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    notes: '',
    dueDate: initialDate || new Date(),
    list: 'Personal',
    isReminderSet: false,
    reminder: formatTimeForToday(new Date()),
    tags: [],
    completed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [allTags, setAllTags] = useState([
    { name: "Work", color: "#FF4D4D" },
    { name: "Personal", color: "#45AFFF" },
    { name: "Important", color: "#FFD84D" },
    { name: "Urgent", color: "#D32F2F" },
    { name: "Shopping", color: "#57CC57" },
    { name: "Ideas", color: "#AB47BC" }
  ]);

  // Format time for today's reminder
  function formatTimeForToday(date) {
    return new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Format date for display
  function formatDate(date) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDate = new Date(date);
    
    if (isSameDay(taskDate, today)) {
      return `Later today, ${formatTimeForToday(taskDate)}`;
    } else if (isSameDay(taskDate, tomorrow)) {
      return `Tomorrow, ${formatTimeForToday(taskDate)}`;
    } else {
      return taskDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }) + `, ${formatTimeForToday(taskDate)}`;
    }
  }

  function isSameDay(date1, date2) {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  const validateForm = () => {
    const newErrors = {};
    if (!taskData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create the final task object
      const finalTaskData = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
        reminder: taskData.isReminderSet ? new Date(
          taskData.dueDate.getFullYear(),
          taskData.dueDate.getMonth(),
          taskData.dueDate.getDate(),
          ...taskData.reminder.split(':')
        ).toISOString() : null
      };

      const success = await onSave(finalTaskData);
      
      if (success) {
        onClose();
      } else {
        setErrors({ submit: 'Failed to save task. Please try again.' });
      }
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    // Close on Escape
    if (e.key === 'Escape') {
      onClose();
    }
    // Save on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [taskData]);

  const handleListClick = () => {
    setShowListPopup(true);
  };

  const handleUpdateList = (newList) => {
    setTaskData({ ...taskData, list: newList });
    setShowListPopup(false);
  };

  const handleTagsClick = () => {
    setShowTagPopup(true);
  };

  const handleSaveTags = (updatedAllTags, selectedTags) => {
    setAllTags(updatedAllTags);
    setTaskData({ ...taskData, tags: selectedTags });
    setShowTagPopup(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = taskData.tags.filter(tag => tag.name !== tagToRemove.name);
    setTaskData({ ...taskData, tags: updatedTags });
  };

  // Get list color helper function
  const getListColor = (listName) => {
    const colors = {
      'Personal': '#4285f4',
      'Work': '#ea4335',
      'Shopping': '#34a853',
      'Ideas': '#fbbc05',
    };
    return colors[listName] || '#9e9e9e';
  };

  return (
    <div className="task-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="task-modal">
        {/* Header */}
        <div className="task-modal-header">
          <div className="breadcrumb-nav">
            <span>My lists</span>
            <span className="breadcrumb-separator">></span>
            <span>{taskData.list}</span>
          </div>
          <div className="task-type-selector">
            <button className={`type-btn ${!taskData.isShared ? 'active' : ''}`}>
              Task
            </button>
            <button className={`type-btn ${taskData.isShared ? 'active' : ''}`}>
              Shared task
            </button>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Task Form */}
        <form onSubmit={handleSubmit} className="task-form">
          <input
            type="text"
            className={`title-input ${errors.title ? 'error' : ''}`}
            placeholder="Add title"
            value={taskData.title}
            onChange={(e) => {
              setTaskData({ ...taskData, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            autoFocus
          />
          {errors.title && <div className="error-message">{errors.title}</div>}

          <div className="quick-actions">
            <button 
              type="button"
              className="quick-action-btn reminder-btn"
              onClick={() => setTaskData({ ...taskData, isReminderSet: !taskData.isReminderSet })}
            >
              <FontAwesomeIcon icon={faBell} />
              <span>{formatDate(taskData.dueDate)}</span>
            </button>
            
            <button 
              type="button"
              className="quick-action-btn list-btn"
              onClick={handleListClick}
            >
              <span className="list-color" style={{ backgroundColor: getListColor(taskData.list) }}></span>
              <span>{taskData.list}</span>
            </button>
            
            <button 
              type="button"
              className="quick-action-btn tags-btn"
              onClick={handleTagsClick}
            >
              <FontAwesomeIcon icon={faTags} />
              <span>{taskData.tags.length > 0 ? `${taskData.tags.length} tags` : "Tags"}</span>
            </button>
          </div>

          {taskData.tags.length > 0 && (
            <div className="tags-display">
              {taskData.tags.map(tag => (
                <div 
                  key={tag.name}
                  className="tag-badge"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }} 
                >
                  <FontAwesomeIcon icon={faTag} className="tag-icon" />
                  <span className="tag-name">{tag.name}</span>
                  <button 
                    type="button"
                    className="remove-tag-btn" 
                    onClick={() => handleRemoveTag(tag)}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))}
              <button type="button" className="add-tag-badge" onClick={handleTagsClick}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add tag</span>
              </button>
            </div>
          )}

          <textarea
            className="notes-input"
            placeholder="Add notes..."
            value={taskData.notes}
            onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
          />

          {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

          <div className="modal-footer">
            <button 
              type="submit" 
              className="save-btn" 
              disabled={isSubmitting}
            >
              Save
            </button>
          </div>
        </form>

        {showListPopup && (
          <ListEditPopup
            lists={availableLists}
            selectedList={taskData.list}
            onClose={() => setShowListPopup(false)}
            onEdit={handleUpdateList}
          />
        )}

        {showTagPopup && (
          <>
            <div className="tag-popup-overlay" onClick={() => setShowTagPopup(false)}></div>
            <div className="tag-popup-container">
              <TagPopup 
                tags={allTags}
                setTags={setAllTags}
                selectedTags={taskData.tags}
                setSelectedTags={(tags) => setTaskData({ ...taskData, tags })}
                closePopup={() => setShowTagPopup(false)}
                saveTags={handleSaveTags}
                onDelete={(tag) => {
                  setAllTags(allTags.filter(t => t.name !== tag.name));
                  setTaskData({
                    ...taskData,
                    tags: taskData.tags.filter(t => t.name !== tag.name)
                  });
                }}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal; 