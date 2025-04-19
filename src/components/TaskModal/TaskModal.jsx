import React, { useState, useEffect } from 'react';
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
            <span>Personal</span>
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

          <div className="task-options">
            <div className="option-item reminder">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M8 14c1.1 0 2-.9 2-2H6c0 1.1.9 2 2 2zm4-6V6c0-2.21-1.79-4-4-4S4 3.79 4 6v2l-2 2v1h12V9l-2-1z"/>
              </svg>
              <span>{formatDate(taskData.dueDate)}</span>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  checked={taskData.isReminderSet}
                  onChange={(e) => setTaskData({ ...taskData, isReminderSet: e.target.checked })}
                />
                <span className="toggle-slider"></span>
              </div>
            </div>

            <div className="option-item list">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M14 5H2v2h12V5zm0 4H2v2h12V9z"/>
              </svg>
              <select 
                value={taskData.list}
                onChange={(e) => setTaskData({ ...taskData, list: e.target.value })}
              >
                {availableLists.map(list => (
                  <option key={list} value={list}>{list}</option>
                ))}
              </select>
            </div>

            <div className="option-item tags">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M13.707 8.707l-5 5c-.39.39-1.023.39-1.414 0l-5-5c-.39-.39-.39-1.023 0-1.414l5-5c.39-.39 1.023-.39 1.414 0l5 5c.39.39.39 1.023 0 1.414z"/>
              </svg>
              Tags
            </div>
          </div>

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
      </div>
    </div>
  );
};

export default TaskModal; 