import React, { useState, useEffect } from 'react';
import './Next7Days.css';

const Next7Days = () => {
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
        month: 'short', 
        day: 'numeric' 
      });

      // Get the subheader (only for Today and Tomorrow)
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

  // Update days when component mounts and at midnight
  useEffect(() => {
    // Initial generation of days
    setDays(generateSevenDays());

    // Calculate time until next midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilMidnight = tomorrow - now;

    // Set up timer to update days at midnight
    const timer = setTimeout(() => {
      setDays(generateSevenDays());
      // After first update, update every 24 hours
      const dailyTimer = setInterval(() => {
        setDays(generateSevenDays());
      }, 24 * 60 * 60 * 1000);

      return () => clearInterval(dailyTimer);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, []);

  // Sample tasks (you can replace this with your actual tasks)
  const sampleTasks = [
    { id: 1, title: "Watch My day tutorial", list: "Personal" },
    { id: 2, title: "Add me to My Day", list: "Personal" },
    { id: 3, title: "Connect your calendar", list: "Personal" },
    { id: 4, title: "Create your first task", list: "Personal" }
  ];

  return (
    <div className="next7days-container">
      <div className="next7days-header">
        <div className="view-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="#2564CF" strokeWidth="2"/>
            <path d="M16 2V6" stroke="#2564CF" strokeWidth="2"/>
            <path d="M8 2V6" stroke="#2564CF" strokeWidth="2"/>
            <path d="M3 10H21" stroke="#2564CF" strokeWidth="2"/>
          </svg>
          <h1>Next 7 days</h1>
        </div>
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

      <div className="days-scroll-wrapper">
        <div className="days-scroll-container">
          {days.map((day, index) => (
            <div key={day.key} className="day-column">
              <div className="day-header">
                <h2>{day.dayName}</h2>
                {day.subheader && <span className="day-subheader">{day.subheader}</span>}
                <span className="date-label">{day.dateStr}</span>
              </div>

              <div className="day-tasks-list">
                {index === 0 && sampleTasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="task-item">
                    <div className="task-checkbox"></div>
                    <div className="task-content">
                      <div className="task-list-indicator">
                        <span className="list-tag">My lists • Personal</span>
                      </div>
                      <div className="task-title">{task.title}</div>
                    </div>
                  </div>
                ))}
                <button className="add-task-button">
                  <span className="plus-icon">+</span>
                  Add Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Next7Days;