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
  // Store newly added tasks locally before they appear in the props
  const [newlyAddedTasks, setNewlyAddedTasks] = useState([]);
  
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
        key: date.toISOString(), // Unique key for React
        isToday: i === 0 // Flag to identify today
      });
    }
    return days;
  };

  // Generate days on component mount
  useEffect(() => {
    setDays(generateSevenDays());
  }, []);

  // Simple function to check if two dates are the same day
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Filter tasks for each day, including newly added ones
  const getTasksForDay = (date) => {
    // Combine tasks from props with newly added tasks
    const allTasks = [...tasks, ...newlyAddedTasks];
    
    // Filter tasks for this specific day
    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  // Handle adding a task for a specific day
  const handleAddTask = (dayDate) => (newTask) => {
    // Create a clean task object
    const task = {
      id: Date.now(),
      title: newTask.title,
      completed: false,
      list: newTask.list || 'Personal',
      dueDate: dayDate.toISOString(),
      sourceView: 'next7days'
    };
    
    // Debug log to see what we're adding
    console.log(`Adding task for ${dayDate.toDateString()}:`, task);
    
    // Add to local state for immediate visual feedback
    setNewlyAddedTasks(prev => [...prev, task]);
    
    // Also send to parent component
    onAddTask(task);
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
        {days.map((day) => {
          // Get tasks for this specific day
          const dayTasks = getTasksForDay(day.date);
          
          return (
            <div key={day.key} className={`day-column ${day.isToday ? 'today-column' : ''}`}>
              <div className="day-header">
                <div className="day-title">
                  <h2>{day.dayName}</h2>
                  <span className="day-label">{day.dateStr}</span>
                  {dayTasks.length > 0 && (
                    <span className="task-count">{dayTasks.length}</span>
                  )}
                </div>
              </div>

              <div className="day-tasks">
                {/* Render tasks for this day */}
                {dayTasks.map(task => (
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
                
                {/* Add task button for this day */}
                <AddTaskButton 
                  onAddTask={handleAddTask(day.date)}
                  dueDate={day.date}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Next7Days;