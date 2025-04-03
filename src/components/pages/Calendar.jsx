import React from 'react';
import './Calendar.css';

const Calendar = ({ tasks, onToggleComplete, onDelete, onUpdateTags, onUpdateList }) => {
  return (
    <div className="page-content">
      <header className="header-section">
        <div className="greeting-container">
          <h1>My Calendar</h1>
          <p className="subtitle">View your schedule and tasks</p>
        </div>
      </header>
      
      <div className="calendar-content">
        <p>Your calendar view will appear here</p>
      </div>
    </div>
  );
};

export default Calendar; 