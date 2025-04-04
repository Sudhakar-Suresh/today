import React, { useState, useRef, useEffect } from 'react';
import './ReminderPopup.css';

const ReminderPopup = ({ onClose, onSetReminder, initialDate = null }) => {
  // Format today's date as MM/DD/YYYY
  const today = new Date();
  const formattedToday = `${(today.getMonth() + 1).toString().padStart(2, '0')}.${today.getDate().toString().padStart(2, '0')}.${today.getFullYear()}`;
  
  // Initialize with today's date if no initial date is provided
  const [dateInput, setDateInput] = useState(initialDate?.date || formattedToday);
  
  // Initialize with current time (rounded to nearest hour) if no initial time is provided
  const currentHour = today.getHours();
  const formattedCurrentTime = `${currentHour.toString().padStart(2, '0')}:${today.getMinutes() >= 30 ? '30' : '00'}`;
  const [timeInput, setTimeInput] = useState(initialDate?.time || formattedCurrentTime);
  
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const timeDropdownRef = useRef(null);
  const dropdownMenuRef = useRef(null);
  
  // Parse the date input to set up the calendar
  const parseInitialDate = () => {
    if (dateInput) {
      const [month, day, year] = dateInput.split('.');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return today;
  };
  
  // Current displayed month/year
  const [currentDate, setCurrentDate] = useState(parseInitialDate());
  const [selectedDay, setSelectedDay] = useState(parseInitialDate().getDate());
  
  // Generate calendar data
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(year, month, 1).getDay();
    // Adjust for Monday as first day of week
    const firstDayIndex = firstDay === 0 ? 6 : firstDay - 1;
    
    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        month: month === 0 ? 11 : month - 1,
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
        currentMonth: true,
        isSelected: i === selectedDay && month === currentDate.getMonth() && year === currentDate.getFullYear()
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: month === 11 ? 0 : month + 1,
        year: month === 11 ? year + 1 : year,
        currentMonth: false
      });
    }
    
    return days;
  };
  
  const [calendarDays, setCalendarDays] = useState(generateCalendarDays());
  
  // Update calendar when month changes
  useEffect(() => {
    setCalendarDays(generateCalendarDays());
  }, [currentDate, selectedDay]);
  
  // Function to navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Function to navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Handle clicking a day in the calendar
  const handleDayClick = (day) => {
    // Update selected day
    setSelectedDay(day.day);
    
    // Update date input with selected date
    const formattedMonth = (day.month + 1).toString().padStart(2, '0');
    const formattedDay = day.day.toString().padStart(2, '0');
    setDateInput(`${formattedMonth}.${formattedDay}.${day.year}`);
    
    // If clicked on a day from another month, switch to that month
    if (!day.currentMonth) {
      setCurrentDate(new Date(day.year, day.month, 1));
    }
  };
  
  // Handle clicking on time input
  const handleTimeClick = () => {
    setShowTimeDropdown(!showTimeDropdown);
  };
  
  // Generate time options for dropdown (hourly increments)
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour.toString().padStart(2, '0');
      options.push(`${formattedHour}:00`);
      options.push(`${formattedHour}:30`);
    }
    return options;
  };
  
  const timeOptions = generateTimeOptions();
  
  // Handle selecting a time from dropdown
  const handleTimeOptionClick = (time) => {
    setTimeInput(time);
    setShowTimeDropdown(false);
  };
  
  // Handle clicking outside of time dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target)) {
        setShowTimeDropdown(false);
      }
      
      if (dropdownMenuRef.current && !dropdownMenuRef.current.contains(event.target)) {
        setShowDropdownMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle setting the reminder
  const handleSetReminder = () => {
    if (dateInput && timeInput) {
      const [month, day, year] = dateInput.split('.');
      const reminderDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${timeInput}:00`);
      
      onSetReminder({
        date: dateInput,
        time: timeInput,
        fullDate: reminderDate
      });
      
      onClose();
    }
  };
  
  // Handle quick option selections
  const setTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const month = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrow.getDate().toString().padStart(2, '0');
    const year = tomorrow.getFullYear();
    
    setDateInput(`${month}.${day}.${year}`);
    setCurrentDate(new Date(year, tomorrow.getMonth(), 1));
    setSelectedDay(tomorrow.getDate());
  };
  
  const setNextWeek = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const month = (nextWeek.getMonth() + 1).toString().padStart(2, '0');
    const day = nextWeek.getDate().toString().padStart(2, '0');
    const year = nextWeek.getFullYear();
    
    setDateInput(`${month}.${day}.${year}`);
    setCurrentDate(new Date(year, nextWeek.getMonth(), 1));
    setSelectedDay(nextWeek.getDate());
  };
  
  // Day names for weekday headers
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Format month and year for display
  const formatMonthYear = () => {
    return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getFullYear()}`;
  };
  
  return (
    <div className="reminder-popup">
      <div className="reminder-header">
        <h2>Reminder</h2>
      </div>
      
      <div className="reminder-body">
        <div className="input-container">
          <div className="input-group">
            <label>DATE</label>
            <input 
              type="text" 
              className="date-input" 
              value={dateInput} 
              onChange={(e) => setDateInput(e.target.value)}
              placeholder="MM.DD.YYYY"
            />
          </div>
          
          <div className="input-group">
            <label>TIME</label>
            <div className="time-input-container" ref={timeDropdownRef}>
              <input 
                type="text" 
                className="time-input" 
                value={timeInput} 
                onChange={(e) => setTimeInput(e.target.value)}
                onClick={handleTimeClick} 
                placeholder="HH:MM"
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
        
        <div className="calendar-container">
          <div className="calendar-header">
            <h3>{formatMonthYear()}</h3>
            <div className="calendar-nav">
              <button className="nav-button prev" onClick={prevMonth}>❮</button>
              <button className="nav-button next" onClick={nextMonth}>❯</button>
            </div>
          </div>
          
          <div className="weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          
          <div className="days">
            {calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`day ${!day.currentMonth ? 'other-month' : ''} ${day.isSelected ? 'selected' : ''}`} 
                onClick={() => handleDayClick(day)}
              >
                {day.day}
              </div>
            ))}
          </div>
        </div>
        
        <div className="quick-options">
          <button className="quick-option" onClick={setTomorrow}>Tomorrow</button>
          <button className="quick-option" onClick={setNextWeek}>Next week</button>
          <button className="quick-option">Someday</button>
          <div className="recurring-option">
            <span className="recurring-icon">↻</span> Recurring
          </div>
        </div>
      </div>
      
      <div className="reminder-footer">
        <button className="cancel-button" onClick={onClose}>Cancel</button>
        <button className="set-button" onClick={handleSetReminder}>Set</button>
      </div>
    </div>
  );
};

export default ReminderPopup; 