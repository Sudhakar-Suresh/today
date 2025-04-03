import React from 'react';
import './AllTasks.css';

const AllTasks = ({ tasks, onToggleComplete, onDelete, onUpdateTags, onUpdateList }) => {
  return (
    <div className="page-content">
      <header className="header-section">
        <div className="greeting-container">
          <h1>All Tasks</h1>
          <p className="subtitle">View and manage all your tasks in one place</p>
        </div>
      </header>
      
      <div className="all-tasks-content">
        <p>Your all tasks will appear here</p>
      </div>
    </div>
  );
};

export default AllTasks; 