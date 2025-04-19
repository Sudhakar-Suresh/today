import React, { useState, useEffect } from 'react';
import './Calendar.css';
import TaskCard from '../TaskCard/TaskCard';
import TaskModal from '../TaskModal/TaskModal';

const Calendar = ({ 
  tasks = [], 
  onAddTask,
  onToggleComplete, 
  onDelete, 
  onUpdateTags, 
  onUpdateList,
  onTogglePin,
  onUpdateReminder,
  availableLists = [],
  pageTitle = 'My Calendar'
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarTasks, setCalendarTasks] = useState(tasks);

  // Update local tasks when props tasks change
  useEffect(() => {
    setCalendarTasks(tasks);
  }, [tasks]);

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowTaskModal(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      // Create the new task object
      const newTask = {
        ...taskData,
        id: Date.now(),
        dueDate: selectedDate.toISOString(),
        created: new Date().toISOString()
      };
      
      // First update the parent component's state
      await onAddTask(newTask);
      
      // Then update local state
      setCalendarTasks(prev => [...prev, newTask]);
      
      // Close the modal
      setShowTaskModal(false);
      return true; // Indicate successful save
    } catch (error) {
      console.error('Error saving task:', error);
      return false; // Indicate failed save
    }
  };

  const getTasksForDay = (date) => {
    return calendarTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return isSameDay(taskDate, date);
    });
  };

  const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (date) => {
    return isSameDay(date, new Date());
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

  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const calendarDays = getCalendarDays();

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div className="header-left">
          <button 
            className="today-btn"
            onClick={() => {
              const today = new Date();
              setCurrentDate(today);
            }}
          >
            TODAY
          </button>
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
          {calendarDays.map((day, index) => {
            const dayTasks = getTasksForDay(day.date);
            
            return (
              <div 
                key={index}
                className={`calendar-day ${
                  day.isCurrentMonth ? 'current-month' : 'other-month'
                } ${day.isToday ? 'today' : ''}`}
                onClick={() => handleDayClick(day.date)}
              >
                <div className="day-content">
                  <div className="day-header">
                    <span className="day-number">{day.dayNumber}</span>
                    {dayTasks.length > 0 && (
                      <span className="task-count">{dayTasks.length}</span>
                    )}
                  </div>
                  <div className="day-tasks">
                    {dayTasks.map(task => (
                      <div key={task.id} className="task-preview">
                        <span 
                          className="task-dot"
                          style={{ backgroundColor: task.list === 'Personal' ? '#0078d4' : 
                                                  task.list === 'Work' ? '#107c41' : 
                                                  task.list === 'Shopping' ? '#ff8c00' : '#666' }}
                        ></span>
                        <span className="task-title">{task.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => setShowTaskModal(false)}
          onSave={handleSaveTask}
          initialDate={selectedDate}
          availableLists={availableLists}
        />
      )}
    </div>
  );
};

export default Calendar; 