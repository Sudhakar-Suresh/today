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
  availableLists = []
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
          list: "Personal"
        });
      }
      setNewTaskTitle('');
    }
  };

  return (
    <div className="my-day-container">
      <div className="my-day-content">
        <header>
          <h1>{greeting}, Sudhakar<span className="dot">.</span></h1>
          <p className="subtitle">Run your day or your day will run you</p>
        </header>
        
        <section className="date-section">
          <div className="date-container">
            <div className="date-label">{dayOfWeek}</div>
            <div className="date-number">{dayNumber}</div>
            <div className="date-month">{month}</div>
          </div>
          <div className="events-info">
            <p>You have no events scheduled for today</p>
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
          ) : (
            <div className="no-tasks-message">
              <p>You have no active tasks for today</p>
            </div>
          )}
        </div>
        
        <div className="add-task-container">
          <form onSubmit={handleAddTask}>
            <div className="add-task-input">
              <span className="task-icon">✓</span>
              <input 
                type="text" 
                placeholder="Enter task title" 
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
              />
              <button type="submit" className="submit-arrow">↑</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyDay; 