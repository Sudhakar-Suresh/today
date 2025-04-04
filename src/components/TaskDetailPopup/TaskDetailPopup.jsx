import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faXmark,
  faCheck,
  faEllipsisVertical,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
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
  onAddAttachment
}) => {
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null);
  const [list, setList] = useState(task.list || "Personal");
  const popupRef = useRef(null);
  
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
    // This would typically open a date picker or reminder selection UI
    console.log("Open reminder dialog");
  };

  const handleAttachmentClick = () => {
    // This would typically open a file picker
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = (e) => {
      if (e.target.files.length > 0) {
        onAddAttachment(task.id, e.target.files[0]);
      }
    };
    fileInput.click();
  };

  const completedSubtasksCount = subtasks.filter(st => st.completed).length;

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
              <button className="icon-button" title="Mark as complete">
                <FontAwesomeIcon icon={faCheck} />
              </button>
              <button className="icon-button" title="Delete task">
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
            <button className="quick-action-btn reminder-btn">
              <FontAwesomeIcon icon={faBell} />
              <span>Remind me</span>
            </button>
            
            <button className="quick-action-btn list-btn">
              <span className="list-color"></span>
              <span>{list}</span>
            </button>
            
            <button className="quick-action-btn tags-btn">
              <span className="hashtag">#</span>
              <span>Tags</span>
            </button>
          </div>
          
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
            <div className="attachments-dropzone" onClick={handleAttachmentClick}>
              <span className="dropzone-text">Click to add / drop your files here</span>
            </div>
          </div>
        </div>
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
  onAddAttachment: PropTypes.func
};

export default TaskDetailPopup; 