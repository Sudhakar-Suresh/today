import React, { useState } from 'react';
import './Calendar.css';
import TaskCard from '../TaskCard/TaskCard';

const Calendar = ({ 
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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState(null);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        dayNumber: daysInPrevMonth - i,
        isCurrentMonth: false
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        dayNumber: i,
        isCurrentMonth: true,
        isToday: isToday(new Date(year, month, i))
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        dayNumber: i,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleAddTask = (date) => {
    const task = {
      id: Date.now(),
      title: '',
      completed: false,
      dueDate: date.toISOString(),
      list: 'Personal'
    };
    onAddTask(task);
  };

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const calendarDays = getCalendarDays();

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div className="header-left">
          <button className="today-btn">TODAY</button>
          <div className="month-navigation">
            <button className="nav-btn" onClick={() => navigateMonth(-1)}>&lt;</button>
            <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
            <button className="nav-btn" onClick={() => navigateMonth(1)}>&gt;</button>
          </div>
          <button className="connect-btn">Connect</button>
        </div>
        <div className="header-right">
          <select className="view-select" defaultValue="MONTH">
            <option value="MONTH">MONTH</option>
          </select>
          <button className="more-btn">•••</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="weekdays-header">
          {weekDays.map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="days-grid">
          {calendarDays.map((day, index) => (
            <div 
              key={index}
              className={`calendar-day ${
                day.isCurrentMonth ? 'current-month' : 'other-month'
              } ${day.isToday ? 'today' : ''}`}
            >
              <div className="day-content">
                <span className="day-number">{day.dayNumber}</span>
                <div className="task-input-wrapper">
                  <input 
                    type="text" 
                    className="task-input"
                    placeholder="Add to My Day"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleAddTask(day.date);
                        e.target.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 