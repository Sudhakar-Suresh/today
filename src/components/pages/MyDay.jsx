import React, { useState } from 'react';
import './MyDay.css';
import TaskCard from '../TaskCard/TaskCard';

const MyDay = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "sdfSD",
      completed: false,
      list: "Personal"
    }
  ]);
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
      setTasks([...tasks, {
        id: Date.now(),
        title: newTaskTitle,
        completed: false,
        list: "Personal"
      }]);
      setNewTaskTitle('');
    }
  };

  const handleToggleComplete = (taskId, isCompleted) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: isCompleted } : task
    ));
  };
  
  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleUpdateTags = (taskId, newTags) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, tags: newTags } : task
    ));
  };
  
  const handleUpdateList = (taskId, newList) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, list: newList } : task
    ));
  };
  
  const handleTogglePin = (taskId, isPinned) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, pinned: isPinned } : task
    ));
  };
  
  const handleUpdateReminder = (taskId, reminderData) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, reminder: reminderData } : task
    ));
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
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={handleDelete}
              onToggleComplete={handleToggleComplete}
              onUpdateTags={handleUpdateTags}
              onUpdateList={handleUpdateList}
              onTogglePin={handleTogglePin}
              onUpdateReminder={handleUpdateReminder}
            />
          ))}
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