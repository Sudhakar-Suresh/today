import React, { useState } from 'react';
import './AddTask.css';

const AddTask = ({ onAddTask }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.trim()) {
      onAddTask({
        id: Date.now(),
        title: taskTitle,
        list: 'Personal',
        tags: [],
        completed: false
      });
      setTaskTitle('');
    }
  };

  return (
    <div className="add-task-container">
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="input-wrapper">
          <span className="task-icon">☐</span>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="task-input"
          />
          <button type="submit" className="submit-button">
            <span className="arrow-icon">↑</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTask; 