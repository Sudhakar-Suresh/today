import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faTags,
  faFolder,
  faXmark,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import ListEditPopup from '../ListEditPopup/ListEditPopup';
import TagPopup from '../TagPopup/TagPopup';
import ConfirmationPopup from '../ConfirmationPopup/ConfirmationPopup';
import './TaskModal.css';

const TaskModal = ({ onClose, onSave, availableLists = ['Personal', 'Work', 'Shopping', 'Ideas'] }) => {
  // Main task data state
  const [taskData, setTaskData] = useState({
    title: '', // Removed hardcoded 'sdf'
    notes: '',
    reminder: 'Later today, 2:22PM',
    list: 'Personal',
    reminderEnabled: false,
    tags: []
  });

  // UI state
  const [showListPopup, setShowListPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  
  // Tags state
  const [allTags, setAllTags] = useState([
    { name: "Work", color: "#FF4D4D" },
    { name: "Personal", color: "#45AFFF" },
    { name: "Important", color: "#FFD84D" },
    { name: "Urgent", color: "#D32F2F" },
    { name: "Shopping", color: "#57CC57" },
    { name: "Ideas", color: "#AB47BC" }
  ]);

  // Add new state for confirmation popup
  const [showConfirmation, setShowConfirmation] = useState(false);

  // List handlers
  const handleListClick = () => {
    setShowListPopup(true);
  };

  const handleUpdateList = (newList) => {
    setTaskData({ ...taskData, list: newList });
    setShowListPopup(false);
  };

  // Tag handlers
  const handleTagsClick = () => {
    setShowTagPopup(true);
  };

  const handleSaveTags = (updatedAllTags, selectedTags) => {
    setAllTags(updatedAllTags);
    setTaskData(prev => ({
      ...prev,
      tags: selectedTags
    }));
    setShowTagPopup(false);
  };

  // Add title change handler
  const handleTitleChange = (e) => {
    setTaskData({ ...taskData, title: e.target.value });
  };

  // Save handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalTaskData = {
      ...taskData,
      created: new Date().toISOString(),
      dueDate: new Date().toISOString(), // You might want to parse the reminder time properly
      completed: false
    };

    onSave(finalTaskData);
    onClose();
  };

  // Update close handler to check for changes
  const hasUnsavedChanges = () => {
    return taskData.title.trim() || taskData.notes.trim() || taskData.tags.length > 0;
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmation(true);
    } else {
      onClose();
    }
  };

  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Handle modal click to prevent propagation
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="task-modal-overlay" onClick={handleOverlayClick}>
        <div className="task-modal" onClick={handleModalClick}>
          {/* Header */}
          <div className="modal-header">
            <div className="task-type-toggle">
              <button className="type-btn active">Task</button>
              <button className="type-btn">Shared task</button>
            </div>
            <button className="close-button" onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="breadcrumb">
            <span className="breadcrumb-text">My lists</span>
            <span className="breadcrumb-separator">
              <FontAwesomeIcon icon={faChevronRight} />
            </span>
            <span className="breadcrumb-text">{taskData.list}</span>
          </div>

          {/* Title Input - Replace static title with input */}
          <div className="title-section">
            <input
              type="text"
              className="task-title-input"
              placeholder="Add task name"
              value={taskData.title}
              onChange={handleTitleChange}
              autoFocus
            />
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button 
              className={`action-btn reminder-btn ${taskData.reminderEnabled ? 'active' : ''}`}
              onClick={() => setTaskData({ 
                ...taskData, 
                reminderEnabled: !taskData.reminderEnabled 
              })}
            >
              <div className="btn-content">
                <FontAwesomeIcon icon={faBell} />
                <span>Later today, 2:22PM</span>
              </div>
              <div className="toggle-switch">
                <div className={`toggle-slider ${taskData.reminderEnabled ? 'active' : ''}`} />
              </div>
            </button>

            <button 
              className="action-btn list-btn"
              onClick={handleListClick}
            >
              <FontAwesomeIcon icon={faFolder} />
              <span>{taskData.list}</span>
            </button>

            <button 
              className="action-btn tags-btn"
              onClick={handleTagsClick}
            >
              <FontAwesomeIcon icon={faTags} />
              <span>
                {taskData.tags.length > 0 
                  ? `${taskData.tags.length} tag${taskData.tags.length === 1 ? '' : 's'}`
                  : 'Tags'
                }
              </span>
            </button>
          </div>

          {/* Notes Input */}
          <textarea
            className="notes-input"
            placeholder="Add notes..."
            value={taskData.notes}
            onChange={(e) => setTaskData({ ...taskData, notes: e.target.value })}
          />

          {/* Save Button */}
          <div className="modal-footer">
            <button className="save-btn" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>

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
          <div className="tag-popup-overlay" onClick={() => setShowTagPopup(false)} />
          <TagPopup
            tags={allTags}
            setTags={setAllTags}
            selectedTags={taskData.tags}
            setSelectedTags={(tags) => setTaskData(prev => ({ ...prev, tags }))}
            closePopup={() => setShowTagPopup(false)}
            saveTags={handleSaveTags}
            onDelete={(tag) => {
              const updatedTags = allTags.filter(t => t.name !== tag.name);
              const updatedSelectedTags = taskData.tags.filter(t => t.name !== tag.name);
              setAllTags(updatedTags);
              setTaskData(prev => ({ ...prev, tags: updatedSelectedTags }));
            }}
          />
        </>
      )}

      {showConfirmation && (
        <ConfirmationPopup
          message="Are you sure you want to discard your changes?"
          onConfirm={() => {
            setShowConfirmation(false);
            onClose();
          }}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </>
  );
};

export default TaskModal; 