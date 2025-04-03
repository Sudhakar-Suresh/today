import React from 'react';
import './Next7Days.css';

const Next7Days = ({ tasks, onToggleComplete, onDelete, onUpdateTags, onUpdateList }) => {
  return (
    <div className="page-content">
      <header className="header-section">
        <div className="greeting-container">
          <h1>Next 7 Days</h1>
          <p className="subtitle">Plan your week ahead</p>
        </div>
      </header>
      
      <div className="next7days-content">
        <p>Your upcoming tasks for the next 7 days will appear here</p>
      </div>
    </div>
  );
};

export default Next7Days; 