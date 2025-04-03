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
      <div className="add-task-button" onClick={() => document.querySelector('.task-input').focus()}>
        <span className="plus-icon">+</span> Add task
      </div>
      <form onSubmit={handleSubmit} className="add-task-form">
        <div className="input-wrapper">
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Enter task title"
            className="task-input"
          />
        </div>
      </form>
    </div>
  );
};

export default AddTask; 