import React, { useState, useRef, useEffect } from 'react';
import './AddTaskButton.css';

const AddTaskButton = ({ onAddTask, dueDate, sourceView = 'default' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const formRef = useRef(null);

  // Handle clicks outside the component
  useEffect(() => {
    function handleClickOutside(event) {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsExpanded(false);
        setTaskTitle('');
      }
    }

    // Add event listener when expanded
    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask({
        id: Date.now(),
        title: taskTitle,
        completed: false,
        list: 'Personal',
        dueDate: dueDate,
        sourceView: sourceView
      });
      setTaskTitle('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setTaskTitle('');
    }
  };

  if (isExpanded) {
    return (
      <div className="add-task-expanded" ref={formRef}>
        <span className="arrow-up">↑</span>
        <input
          type="text"
          className="task-input"
          placeholder=""
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <div className="task-actions">
        </div>
      </div>
    );
  }

  return (
    <button 
      className="add-task-button" 
      onClick={() => setIsExpanded(true)}
    >
      <span>+ Add Task</span>
      
    </button>
  );
};

export default AddTaskButton; 