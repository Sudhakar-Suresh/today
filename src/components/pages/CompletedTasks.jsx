import React from 'react';
import './CompletedTasks.css';

const CompletedTasks = ({ tasks, onDelete, onUpdateTags, onUpdateList }) => {
  return (
    <div className="page-content">
      <header className="header-section">
        <div className="greeting-container">
          <h1>Completed Tasks</h1>
          <p className="subtitle">Review what you've accomplished</p>
        </div>
      </header>
      
      <div className="completed-tasks-content">
        <p>Your completed tasks will appear here</p>
      </div>
    </div>
  );
};

export default CompletedTasks; 