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
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      date.setHours(0, 0, 0, 0);
      
      let dayName = '';
      if (i === 0) dayName = 'Today';
      else if (i === 1) dayName = 'Tomorrow';
      else dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

      const dateStr = date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      days.push({
        date,
        dayName,
        dateStr,
        key: date.toISOString(),
        isToday: i === 0
      });
    }
    return days;
  };

  // Update days when tasks change
  useEffect(() => {
    setDays(generateSevenDays());
  }, [tasks]); // Update when tasks change

  // Simplified date comparison
  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  };

  // Simplified task filtering
  const getTasksForDay = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      return isSameDay(new Date(task.dueDate), date);
    });
  };

  // Simplified task addition
  const handleAddTask = (dayDate) => (newTask) => {
    const taskDate = new Date(dayDate);
    taskDate.setHours(0, 0, 0, 0);

    const task = {
      id: Date.now(),
      title: newTask.title,
      completed: false,
      list: newTask.list || 'Personal',
      dueDate: taskDate.toISOString(),
      sourceView: 'next7days'
    };
    
    // Call the parent's onAddTask
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