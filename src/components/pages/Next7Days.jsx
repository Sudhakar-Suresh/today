import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './Next7Days.css';

const Next7Days = ({ 
  tasks = [], 
  onToggleComplete, 
  onDelete, 
  onUpdateTags, 
  onUpdateList,
  onTogglePin,
  onUpdateReminder,
  availableLists = []
}) => {
  // Get next 7 days
  const today = new Date();
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  // Format day name and date for display
  const formatDay = (date) => {
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const isToday = date.getDate() === today.getDate() && 
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
    
    return isToday ? 'Today' : day;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="page-content next7days-page">
      <header className="header-section">
        <div className="greeting-container">
          <h1>Next 7 Days</h1>
          <p className="subtitle">Plan your upcoming tasks</p>
        </div>
      </header>
      
      <div className="next7days-content">
        {next7Days.map((date, index) => (
          <div key={index} className="day-section">
            <div className="day-header">
              <h2>{formatDay(date)}</h2>
              <span className="date-label">{formatDate(date)}</span>
            </div>
            
            <div className="day-tasks">
              {tasks.length > 0 ? (
                tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={onDelete}
                    onToggleComplete={onToggleComplete}
                    onUpdateTags={onUpdateTags}
                    onUpdateList={onUpdateList}
                    onTogglePin={onTogglePin}
                    onUpdateReminder={onUpdateReminder}
                    availableLists={availableLists}
                  />
                ))
              ) : (
                <p className="no-tasks-message">No tasks for this day</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Next7Days; 