import React, { useState, useEffect } from 'react';
import './Next7Days.css';
import TaskCard from '../TaskCard/TaskCard';
import AddTaskButton from '../AddTaskButton/AddTaskButton';

const Next7Days = ({ 
  tasks = [], 
  onAddTask, 
  onToggleComplete, 
  onDelete, 
  onUpdateTags, 
  onUpdateList,
  onTogglePin,
  onUpdateReminder,
  availableLists = [],
  isSidebarExpanded = false
}) => {
  const [days, setDays] = useState([]);

  // Function to generate exactly 7 days from today
  const generateSevenDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Format the day name
      let dayName = '';
      if (i === 0) dayName = 'Today';
      else if (i === 1) dayName = 'Tomorrow';
      else dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      // Format the date (e.g., "Jun 15")
      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short' 
      });

      // Get the subheader for today and tomorrow
      const subheader = i <= 1 ? date.toLocaleDateString('en-US', { weekday: 'long' }) : '';

      days.push({
        date,
        dayName,
        dateStr,
        subheader,
        key: date.toISOString() // Unique key for React
      });
    }
    return days;
  };

  // Generate days on component mount
  useEffect(() => {
    setDays(generateSevenDays());
  }, []);

  // Filter tasks for each day
  const getTasksForDay = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  return (
    <div className={`next7days-container ${isSidebarExpanded ? 'with-sidebar' : 'full-width'}`}>
      <div className="next7days-header">
        <h1>Next 7 days</h1>
        <div className="view-actions">
          <button className="filter-button">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M14.5 2H1.5L6.5 8.234V12.5L9.5 14V8.234L14.5 2Z" stroke="#666"/>
            </svg>
            Filter
          </button>
          <button className="more-button">•••</button>
        </div>
      </div>

      <div className="days-grid">
        {days.map((day) => (
          <div key={day.key} className="day-column">
            <div className="day-header">
              <div className="day-title">
                <h2>{day.dayName}</h2>
                <span className="day-label">{day.dateStr}</span>
              </div>
            </div>

            <div className="day-tasks">
              {getTasksForDay(day.date).map(task => (
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
              ))}
              <AddTaskButton 
                onAddTask={onAddTask} 
                dueDate={day.date}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Next7Days;