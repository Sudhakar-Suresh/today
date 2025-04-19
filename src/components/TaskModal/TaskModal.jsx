import React, { useState } from 'react';
import './TaskModal.css';

const TaskModal = ({ onClose, onSave }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    notes: '',
    reminder: 'Later today, 2:22PM',
    list: 'Personal',
    reminderEnabled: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(taskData);
  };

  return (
    <div className="task-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="task-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="task-type-toggle">
            <button className="type-btn active">Task</button>
            <button className="type-btn">Shared task</button>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span className="breadcrumb-text">My lists</span>
          <span className="breadcrumb-separator">></span>
          <span className="breadcrumb-text">Personal</span>
        </div>

        {/* Logo */}
        <div className="logo-section">
          <img src="path-to-your-logo.png" alt="sdf" className="task-logo" />
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
            <span className="reminder-icon">⏰</span>
            <span>Later today, 2:22PM</span>
            <div className="toggle-switch">
              <div className={`toggle-slider ${taskData.reminderEnabled ? 'active' : ''}`} />
            </div>
          </button>

          <button className="action-btn list-btn">
            <span className="list-icon">📁</span>
            <span>Personal</span>
          </button>

          <button className="action-btn tags-btn">
            <span className="tags-icon">#</span>
            <span>Tags</span>
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
  );
};

export default TaskModal; 