import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faXmark,
  faCheck,
  faEllipsisVertical,
  faPlus,
  faTags,
  faPaperclip,
  faTag,
  faFileImage,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFilePowerpoint,
  faFile,
  faEye,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import ReminderPopup from "../ReminderPopup/ReminderPopup";
import TagPopup from "../TagPopup/TagPopup";
import ListEditPopup from '../ListEditPopup/ListEditPopup';
import "./TaskDetailPopup.css";

const TaskDetailPopup = ({
  task,
  onClose,
  onUpdateTitle,
  onUpdateNotes,
  onToggleComplete,
  onUpdateList,
  onUpdateReminder,
  onUpdateTags,
  onUpdateSubtasks,
  onAddAttachment,
  availableLists = ['Personal', 'Work', 'Shopping', 'Ideas']
}) => {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null);
  const [list, setList] = useState(task.list || "Personal");
  const [showReminderPopup, setShowReminderPopup] = useState(false);
  const [showTagPopup, setShowTagPopup] = useState(false);
  const [showListPopup, setShowListPopup] = useState(false);
  const [tags, setTags] = useState(task.tags || []);
  
  // Sample tags - in a real app, these would be fetched from a database or API
  const [allTags, setAllTags] = useState([
    { name: "Work", color: "#FF4D4D" },
    { name: "Personal", color: "#45AFFF" },
    { name: "Important", color: "#FFD84D" },
    { name: "Urgent", color: "#D32F2F" },
    { name: "Shopping", color: "#57CC57" },
    { name: "Ideas", color: "#AB47BC" }
  ]);
  
  const [selectedReminder, setSelectedReminder] = useState(task.reminder || null);
  const [attachments, setAttachments] = useState(task.attachments || []);
  const fileInputRef = useRef(null);
  const popupRef = useRef(null);
  const tagBtnRef = useRef(null);
  
  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Update local tags when task tags change
  useEffect(() => {
    if (task.tags) {
      setTags(task.tags);
    }
  }, [task.tags]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (title !== task.title) {
      onUpdateTitle(task.id, title);
    }
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleNotesBlur = () => {
    if (notes !== task.notes) {
      onUpdateNotes(task.id, notes);
    }
  };

  const handleSubtaskToggle = (index) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].completed = !updatedSubtasks[index].completed;
    setSubtasks(updatedSubtasks);
    onUpdateSubtasks(task.id, updatedSubtasks);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      const updatedSubtasks = [
        ...subtasks,
        { text: newSubtask, completed: false }
      ];
      setSubtasks(updatedSubtasks);
      setNewSubtask("");
      onUpdateSubtasks(task.id, updatedSubtasks);
    }
  };

  const handleNewSubtaskKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddSubtask();
    }
  };

  const handleSubtaskEdit = (index, value) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].text = value;
    setSubtasks(updatedSubtasks);
  };

  const finishSubtaskEdit = (index) => {
    if (subtasks[index].text.trim() === "") {
      // Remove empty subtasks
      const updatedSubtasks = subtasks.filter((_, i) => i !== index);
      setSubtasks(updatedSubtasks);
      onUpdateSubtasks(task.id, updatedSubtasks);
    } else {
      onUpdateSubtasks(task.id, subtasks);
    }
    setEditingSubtaskIndex(null);
  };

  const handleSubtaskKeyDown = (e, index) => {
    if (e.key === "Enter") {
      finishSubtaskEdit(index);
    }
  };

  const handleCompletionToggle = () => {
    onToggleComplete(task.id, !task.completed);
  };

  const handleReminderClick = () => {
    setShowReminderPopup(true);
  };

  const handleSetReminder = (reminderData) => {
    setSelectedReminder(reminderData);
    if (onUpdateReminder) {
      onUpdateReminder(task.id, reminderData);
    }
    setShowReminderPopup(false);
  };

  const handleTagsClick = () => {
    setShowTagPopup(true);
  };

  // Handle saving tags from the TagPopup
  const handleSaveTags = useCallback((updatedAllTags, selectedTags) => {
    setAllTags(updatedAllTags);
    setTags(selectedTags);
    
    if (onUpdateTags) {
      onUpdateTags(task.id, selectedTags);
    }
    setShowTagPopup(false);
  }, [task.id, onUpdateTags]);

  // Handle removing a tag directly from the task
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag.name !== tagToRemove.name);
    setTags(updatedTags);
    
    if (onUpdateTags) {
      onUpdateTags(task.id, updatedTags);
    }
  };

  const handleAttachmentClick = () => {
    // Create and trigger file input element
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      // Create a URL for the file to display it
      const fileUrl = URL.createObjectURL(file);
      
      const newAttachment = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
        url: fileUrl // Add the URL to display the file
      };
      
      const updatedAttachments = [...attachments, newAttachment];
      setAttachments(updatedAttachments);
      
      if (onAddAttachment) {
        onAddAttachment(task.id, newAttachment);
      }
    }
  };

  // Add a function to determine file type icon
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) {
      return <FontAwesomeIcon icon={faFileImage} />;
    } else if (fileType.startsWith('application/pdf')) {
      return <FontAwesomeIcon icon={faFilePdf} />;
    } else if (fileType.includes('document') || fileType.includes('word')) {
      return <FontAwesomeIcon icon={faFileWord} />;
    } else if (fileType.includes('spreadsheet') || fileType.includes('excel')) {
      return <FontAwesomeIcon icon={faFileExcel} />;
    } else if (fileType.includes('presentation') || fileType.includes('powerpoint')) {
      return <FontAwesomeIcon icon={faFilePowerpoint} />;
    } else {
      return <FontAwesomeIcon icon={faFile} />;
    }
  };

  // Add a function to format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Add a function to handle attachment removal
  const handleRemoveAttachment = (attachmentId) => {
    const updatedAttachments = attachments.filter(a => a.id !== attachmentId);
    setAttachments(updatedAttachments);
    // Call the parent handler if it exists
    if (onAddAttachment) {
      onAddAttachment(task.id, updatedAttachments);
    }
  };

  const completedSubtasksCount = subtasks.filter(st => st.completed).length;

  // Format reminder display
  const formatReminderText = () => {
    if (!selectedReminder) return "Remind me";
    
    return `${selectedReminder.date} at ${selectedReminder.time}`;
  };

  // Stop propagation of click events within the tag popup
  const handleTagPopupClick = (e) => {
    e.stopPropagation();
  };

  const handleListClick = () => {
    setShowListPopup(true);
  };

  const handleUpdateList = (newList) => {
    setList(newList);
    if (onUpdateList) {
      onUpdateList(task.id, newList);
    }
    setShowListPopup(false);
  };

  // Add a helper function to assign colors to lists
  const getListColor = (listName) => {
    const colors = {
      'Personal': '#4285f4',
      'Work': '#ea4335',
      'Shopping': '#34a853',
      'Ideas': '#fbbc05',
      // Add more colors for other lists
    };
    
    return colors[listName] || '#9e9e9e'; // Default gray color
  };

  return (
    <div className="task-detail-popup-backdrop">
      <div className="task-detail-popup" ref={popupRef}>
        <div className="popup-header">
          <div className="popup-header-left">
            <a href="#" className="breadcrumb">My lists</a>
            <span className="breadcrumb-separator">›</span>
            <a href="#" className="breadcrumb">{list}</a>
          </div>
          <div className="popup-header-actions">
            <button className="complete-button" onClick={handleCompletionToggle}>
              {task.completed ? "Completed" : "Mark as complete"}
            </button>
            <div className="popup-header-buttons">
              <button className="icon-button" title="Mark as complete" onClick={handleCompletionToggle}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button className="icon-button" title="Close" onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="popup-content">
          <input 
            type="text" 
            className="task-title-input" 
            value={title} 
            onChange={handleTitleChange} 
            onBlur={handleTitleBlur}
          />
          
          <div className="quick-actions">
            <button 
              className="quick-action-btn reminder-btn"
              onClick={handleReminderClick}
            >
              <FontAwesomeIcon icon={faBell} />
              <span>{formatReminderText()}</span>
            </button>
            
            <button 
              className="quick-action-btn list-btn"
              onClick={handleListClick}
            >
              <span className="list-color" style={{ backgroundColor: getListColor(list) }}></span>
              <span>{list}</span>
            </button>
            
            <button 
              className="quick-action-btn tags-btn"
              onClick={handleTagsClick}
              ref={tagBtnRef}
            >
              <FontAwesomeIcon icon={faTags} />
              <span>{tags.length > 0 ? `${tags.length} tags` : "Tags"}</span>
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="tags-display">
              {tags.map(tag => (
                <div 
                  key={tag.name}
                  className="tag-badge"
                  style={{ backgroundColor: tag.color + '20', color: tag.color }} 
                >
                  <FontAwesomeIcon icon={faTag} className="tag-icon" />
                  <span className="tag-name">{tag.name}</span>
                  <button 
                    className="remove-tag-btn" 
                    onClick={() => handleRemoveTag(tag)}
                    title={`Remove ${tag.name} tag`}
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                </div>
              ))}
              <button className="add-tag-badge" onClick={handleTagsClick}>
                <FontAwesomeIcon icon={faPlus} />
                <span>Add tag</span>
              </button>
            </div>
          )}
          
          <div className="notes-section">
            <h3>NOTES</h3>
            <textarea 
              className="notes-textarea" 
              placeholder="Add notes here..." 
              value={notes} 
              onChange={handleNotesChange}
              onBlur={handleNotesBlur}
            ></textarea>
          </div>
          
          <div className="subtasks-section">
            <div className="section-header">
              <h3>SUBTASKS</h3>
              <span className="subtask-counter">{completedSubtasksCount}/{subtasks.length}</span>
              <button className="more-options-btn">
                <FontAwesomeIcon icon={faEllipsisVertical} />
              </button>
            </div>
            
            <ul className="subtasks-list">
              {subtasks.map((subtask, index) => (
                <li key={index} className={`subtask-item ${subtask.completed ? 'completed' : ''}`}>
                  <div className="subtask-checkbox" onClick={() => handleSubtaskToggle(index)}>
                    {subtask.completed && <FontAwesomeIcon icon={faCheck} className="check-icon" />}
                  </div>
                  
                  {editingSubtaskIndex === index ? (
                    <input 
                      type="text" 
                      className="subtask-edit-input"
                      value={subtask.text}
                      onChange={(e) => handleSubtaskEdit(index, e.target.value)}
                      onBlur={() => finishSubtaskEdit(index)}
                      onKeyDown={(e) => handleSubtaskKeyDown(e, index)}
                      autoFocus
                    />
                  ) : (
                    <span 
                      className="subtask-text"
                      onClick={() => setEditingSubtaskIndex(index)}
                    >
                      {subtask.text}
                    </span>
                  )}
                </li>
              ))}
              
              <li className="subtask-item new-subtask">
                <div className="subtask-checkbox"></div>
                <input 
                  type="text" 
                  className="new-subtask-input"
                  placeholder="Add a new subtask"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={handleNewSubtaskKeyDown}
                />
              </li>
            </ul>
          </div>
          
          <div className="attachments-section">
            <h3>ATTACHMENTS</h3>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: 'none' }} 
              onChange={handleFileChange}
            />
            
            {attachments.length > 0 && (
              <ul className="attachments-list">
                {attachments.map(attachment => (
                  <li key={attachment.id} className="attachment-item">
                    <div className="attachment-preview">
                      {attachment.type.startsWith('image/') ? (
                        <img 
                          src={attachment.url} 
                          alt={attachment.name} 
                          className="attachment-image"
                        />
                      ) : (
                        <div className="attachment-icon">
                          {getFileIcon(attachment.type)}
                        </div>
                      )}
                    </div>
                    <div className="attachment-info">
                      <span className="attachment-name">{attachment.name}</span>
                      <span className="attachment-size">
                        {formatFileSize(attachment.size)}
                      </span>
                    </div>
                    <div className="attachment-actions">
                      <a 
                        href={attachment.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="view-attachment-btn"
                        title="View attachment"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </a>
                      <button 
                        className="remove-attachment-btn"
                        onClick={() => handleRemoveAttachment(attachment.id)}
                        title="Remove attachment"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            
            <div className="attachments-dropzone" onClick={handleAttachmentClick}>
              <FontAwesomeIcon icon={faPaperclip} className="attachment-icon" />
              <span className="dropzone-text">Click to add / drop your files here</span>
            </div>
          </div>
        </div>
        
        {showReminderPopup && (
          <ReminderPopup 
            onClose={() => setShowReminderPopup(false)}
            onSetReminder={handleSetReminder}
            initialDate={selectedReminder}
          />
        )}
        
        {showTagPopup && (
          <>
            <div className="tag-popup-overlay" onClick={() => setShowTagPopup(false)}></div>
            <div onClick={handleTagPopupClick} className="tag-popup-container">
              <TagPopup 
                tags={allTags}
                setTags={setAllTags}
                selectedTags={tags}
                setSelectedTags={setTags}
                closePopup={() => setShowTagPopup(false)}
                saveTags={handleSaveTags}
                onDelete={(tag) => {
                  setAllTags(allTags.filter(t => t.name !== tag.name));
                  setTags(tags.filter(t => t.name !== tag.name));
                }}
              />
            </div>
          </>
        )}
        
        {showListPopup && (
          <ListEditPopup
            lists={availableLists}
            selectedList={list}
            onClose={() => setShowListPopup(false)}
            onEdit={handleUpdateList}
          />
        )}
      </div>
    </div>
  );
};

TaskDetailPopup.propTypes = {
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
    attachments: PropTypes.array
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateTitle: PropTypes.func.isRequired,
  onUpdateNotes: PropTypes.func.isRequired,
  onToggleComplete: PropTypes.func.isRequired,
  onUpdateList: PropTypes.func,
  onUpdateReminder: PropTypes.func,
  onUpdateTags: PropTypes.func,
  onUpdateSubtasks: PropTypes.func.isRequired,
  onAddAttachment: PropTypes.func,
  availableLists: PropTypes.arrayOf(PropTypes.string)
};

export default TaskDetailPopup; 