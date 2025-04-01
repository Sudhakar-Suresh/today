import React, { useState, useRef, useEffect } from 'react';
import './ReminderPopup.css';

const ReminderPopup = ({ onClose, onSetReminder, task }) => {
  const [dateInput, setDateInput] = useState('4.1.2025');
  const [timeInput, setTimeInput] = useState('21:42');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeDropdownRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState(1);
  
  // Current displayed month/year
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 1)); // April 2025 (month is 0-indexed)
  
  // Generate time options from 00:00 to 23:45 with 15 min intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        options.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Generate calendar data based on current month/year
  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month and adjust for Monday start (0 = Monday, 6 = Sunday)
    const firstDay = new Date(year, month, 1).getDay();
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
    
    // Get number of days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Previous month days
    const prevMonthDays = Array.from({ length: firstDayIndex }, (_, i) => ({
      day: daysInPrevMonth - firstDayIndex + i + 1,
      currentMonth: false,
      selected: false
    }));
    
    // Current month days
    const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      return {
        day: dayNum,
        currentMonth: true,
        selected: month === 3 && dayNum === selectedDay // April and selected day
      };
    });
    
    // Calculate how many next month days we need
    const totalCells = 42; // 6 rows of 7 days
    const nextMonthDays = Array.from(
      { length: totalCells - prevMonthDays.length - currentMonthDays.length },
      (_, i) => ({
        day: i + 1,
        currentMonth: false,
        selected: false
      })
    );
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };
  
  const [calendarDays, setCalendarDays] = useState(generateCalendarDays(currentDate));
  
  // Update calendar when month/year changes
  useEffect(() => {
    setCalendarDays(generateCalendarDays(currentDate));
  }, [currentDate]);
  
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleSetReminder = () => {
    if (dateInput && timeInput) {
      const [month, day, year] = dateInput.split('.');
      const reminderDate = new Date(`${year}-${month}-${day}T${timeInput}:00`);
      onSetReminder(task?.id || 'new', {
        date: dateInput,
        time: timeInput,
        fullDate: reminderDate
      });
      onClose();
    }
  };

  const handleTimeClick = () => {
    setShowTimeDropdown(!showTimeDropdown);
  };

  const handleTimeOptionClick = (time) => {
    setTimeInput(time);
    setShowTimeDropdown(false);
  };

  const handleDayClick = (day, currentMonth) => {
    if (currentMonth) {
      setSelectedDay(day);
      
      const month = currentDate.getMonth() + 1; // 1-indexed month
      const year = currentDate.getFullYear();
      setDateInput(`${month}.${day}.${year}`);
      
      // Update calendar data
      const updatedCalendarDays = calendarDays.map(dayObj => ({
        ...dayObj,
        selected: dayObj.currentMonth && dayObj.day === day
      }));
      setCalendarDays(updatedCalendarDays);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Format month and year for display
  const formatMonthYear = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="reminder-popup">
      <div className="reminder-content">
        <h3>Reminder</h3>
        
        <div className="input-container">
          <div className="input-group">
            <label>DATE</label>
            <input 
              type="text" 
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="date-input"
              readOnly
            />
          </div>
          
          <div className="input-group">
            <label>TIME</label>
            <div className="time-input-container" ref={timeDropdownRef}>
              <input 
                type="text" 
                value={timeInput}
                onChange={(e) => setTimeInput(e.target.value)}
                onClick={handleTimeClick}
                className="time-input"
              />
              {showTimeDropdown && (
                <div className="time-dropdown">
                  {timeOptions.map((time, index) => (
                    <div 
                      key={index} 
                      className="time-option"
                      onClick={() => handleTimeOptionClick(time)}
                    >
                      {time}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="calendar">
          <div className="month-header">
            <h4>{formatMonthYear(currentDate)}</h4>
            <div className="month-navigation">
              <button className="nav-btn" onClick={prevMonth}>&#10094;</button>
              <button className="nav-btn" onClick={nextMonth}>&#10095;</button>
            </div>
          </div>
          
          <div className="weekdays">
            {daysOfWeek.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="days-grid">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`day ${!day.currentMonth ? 'other-month' : ''} ${day.selected ? 'selected' : ''}`}
                onClick={() => handleDayClick(day.day, day.currentMonth)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="quick-options">
          <button 
            className="quick-option"
            onClick={() => {
              const tomorrow = new Date();
              tomorrow.setDate(tomorrow.getDate() + 1);
              const month = tomorrow.getMonth() + 1;
              const day = tomorrow.getDate();
              const year = tomorrow.getFullYear();
              setDateInput(`${month}.${day}.${year}`);
              setCurrentDate(new Date(year, month - 1, 1)); // Set calendar to the month
              
              // Re-generate calendar with the new date selected
              setTimeout(() => {
                const newCalendarDays = generateCalendarDays(new Date(year, month - 1, 1));
                const updatedCalendarDays = newCalendarDays.map(dayObj => ({
                  ...dayObj,
                  selected: dayObj.currentMonth && dayObj.day === day
                }));
                setCalendarDays(updatedCalendarDays);
              }, 0);
            }}
          >
            Tomorrow
          </button>
          <button 
            className="quick-option"
            onClick={() => {
              const nextWeek = new Date();
              nextWeek.setDate(nextWeek.getDate() + 7);
              const month = nextWeek.getMonth() + 1;
              const day = nextWeek.getDate();
              const year = nextWeek.getFullYear();
              setDateInput(`${month}.${day}.${year}`);
              setCurrentDate(new Date(year, month - 1, 1)); // Set calendar to the month
              
              // Re-generate calendar with the new date selected
              setTimeout(() => {
                const newCalendarDays = generateCalendarDays(new Date(year, month - 1, 1));
                const updatedCalendarDays = newCalendarDays.map(dayObj => ({
                  ...dayObj,
                  selected: dayObj.currentMonth && dayObj.day === day
                }));
                setCalendarDays(updatedCalendarDays);
              }, 0);
            }}
          >
            Next week
          </button>
          <button className="quick-option">Someday</button>
          <div className="recurring-option">
            <span className="sync-icon">↻</span>
            <span>Recurring</span>
          </div>
        </div>
        
        <div className="action-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="set-btn" onClick={handleSetReminder}>Set</button>
        </div>
      </div>
    </div>
  );
};

export default ReminderPopup; 