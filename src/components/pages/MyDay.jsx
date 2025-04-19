import React, { useState } from 'react';
import './MyDay.css';
import TaskCard from '../TaskCard/TaskCard';

const MyDay = ({ 
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
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Get current date information
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const dayNumber = today.getDate();
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  
  // Get greeting based on time of day
  const hour = today.getHours();
  let greeting = "Good Morning";
  if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
  } else if (hour >= 18) {
    greeting = "Good Evening";
  }

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      if (onAddTask) {
        onAddTask({
          id: Date.now(),
          title: newTaskTitle,
          completed: false,
          list: "Personal",
          dueDate: today.toISOString(),
          sourceView: "myday"
        });
      }
      setNewTaskTitle('');
    }
  };

  return (
    <div className={`myday-container ${isSidebarExpanded ? 'with-sidebar' : 'full-width'}`}>
      <div className="my-day-content">
        <header>
          <h1>{greeting}, Sudhakar<span className="dot">.</span></h1>
          <p className="subtitle">This is your private space</p>
        </header>
        
        <section className="date-section-no-card">
          <div className="date-container">
            <div className="date-label">{dayOfWeek}</div>
            <div className="date-number">{dayNumber}</div>
            <div className="date-month">{month}</div>
          </div>
          <div className="events-info">
            <p>Join video meetings with one tap</p>
            <div className="calendar-buttons">
              <button className="calendar-btn">
                <span className="calendar-icon">📅</span> Connect Google Calendar
              </button>
              <button className="calendar-btn">
                <span className="calendar-icon">📅</span> Connect Outlook Calendar
              </button>
            </div>
          </div>
        </section>
        
        <div className="tasks-area">
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
          ) : null}
        </div>
      </div>
      
      <div className="add-task-container">
        <form onSubmit={handleAddTask}>
          <div className="add-task-input">
            <span className="task-icon">✓</span>
            <input 
              type="text" 
              placeholder="Add task" 
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <button type="submit" className="submit-arrow">↑</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyDay; 