import React, { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './Calendar.css';

const Calendar = ({ 
  tasks = [], 
  onToggleComplete, 
  onDelete, 
  onUpdateTags, 
  onUpdateList,
  onTogglePin,
  onUpdateReminder,
  availableLists = []
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
    
    // Get number of days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        currentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        currentMonth: true
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        currentMonth: false
      });
    }
    
    return days;
  };
  
  const days = generateCalendarDays();
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  return (
    <div className="page-content calendar-page">
      <header className="header-section">
        <div className="greeting-container">
          <h1>Calendar</h1>
          <p className="subtitle">View your tasks on a calendar</p>
        </div>
      </header>
      
      <div className="calendar-container">
        <div className="calendar-header">
          <button onClick={prevMonth} className="month-nav">&#10094;</button>
          <h2>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
          <button onClick={nextMonth} className="month-nav">&#10095;</button>
        </div>
        
        <div className="calendar-grid">
          {weekdays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
          
          {days.map((day, index) => (
            <div 
              key={index} 
              className={`calendar-day ${day.currentMonth ? '' : 'other-month'}`}
            >
              <div className="day-number">{day.day}</div>
              <div className="day-tasks">
                {/* In a real app, you'd filter tasks for this specific day */}
                {day.currentMonth && index % 7 === 0 && tasks.length > 0 && (
                  <div className="task-indicator">
                    {tasks.length > 2 ? `${tasks.length} tasks` : `${tasks.length} task`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="tasks-for-selected-day">
        <h3>Today's Tasks</h3>
        {tasks.length > 0 ? (
          <div className="tasks-area">
            {tasks.map(task => (
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
          </div>
        ) : (
          <p className="no-tasks-message">No tasks for today</p>
        )}
      </div>
    </div>
  );
};

export default Calendar; 