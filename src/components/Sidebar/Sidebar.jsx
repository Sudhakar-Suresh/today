import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './Sidebar.css';

// Import animation data
import settingData from '../../assets/sidebar/setting.json';
import calendarData from '../../assets/sidebar/calendar.json';
import dateData from '../../assets/sidebar/date.json';
import taskData from '../../assets/sidebar/task.json';
import bookData from '../../assets/sidebar/book.json';

const Sidebar = ({ onPageChange }) => {
  const settingRef = useRef(null);
  const calendarRef = useRef(null);
  const dateRef = useRef(null);
  const taskRef = useRef(null);
  const bookRef = useRef(null);
  
  const [activeItem, setActiveItem] = useState('My day');
  const [lists, setLists] = useState([
    { name: 'Personal', count: 6 },
    { name: 'Work', count: 0 },
    { name: 'Grocery List', count: 0 },
    { name: 'New', count: 1 }
  ]);
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState('');
  const newListInputRef = useRef(null);

  useEffect(() => {
    // Initialize animations
    const settingAnim = lottie.loadAnimation({
      container: settingRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: settingData
    });

    const calendarAnim = lottie.loadAnimation({
      container: calendarRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: calendarData
    });

    const dateAnim = lottie.loadAnimation({
      container: dateRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: dateData
    });

    const taskAnim = lottie.loadAnimation({
      container: taskRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: taskData
    });
    
    const bookAnim = lottie.loadAnimation({
      container: bookRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: bookData
    });
    
    // Clean up animations on unmount
    return () => {
      settingAnim.destroy();
      calendarAnim.destroy();
      dateAnim.destroy();
      taskAnim.destroy();
      bookAnim.destroy();
    };
  }, []);

  // Focus on the input when it's shown
  useEffect(() => {
    if (showNewListInput && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [showNewListInput]);

  const handleItemHover = (anim) => {
    anim.goToAndPlay(0);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    onPageChange(item);
  };

  const handleListClick = (listName) => {
    setActiveItem(listName);
    onPageChange(listName);
  };

  const handleAddListClick = () => {
    setShowNewListInput(true);
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      // Add new list to local state
      const newList = { name: newListName.trim(), count: 0 };
      setLists([...lists, newList]);
      
      // Call parent callback if exists
      if (onPageChange) {
        onPageChange(newListName.trim());
      }
      
      // Reset state
      setNewListName('');
      setShowNewListInput(false);
    }
  };

  const handleCancelNewList = () => {
    setNewListName('');
    setShowNewListInput(false);
  };

  // Handle click outside to cancel new list input
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showNewListInput && 
        newListInputRef.current && 
        !newListInputRef.current.contains(event.target) &&
        event.target.className !== 'add-list'
      ) {
        handleCancelNewList();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNewListInput]);

  return (
    <div className="sidebar">
      <div className="user-profile">
        <div className="profile-icon">
          <span className="settings-icon" ref={settingRef}></span>
        </div>
        <div className="profile-info">
          <h3>Sudhakar</h3>
          <span className="subtitle">Workspace Account</span>
        </div>
      </div>
      
      <div className="nav-menu">
        <ul>
          <li 
            className={`nav-item ${activeItem === 'My day' ? 'active' : ''}`}
            onClick={() => handleItemClick('My day')}
            onMouseEnter={() => handleItemHover(lottie.getRegisteredAnimations().find(anim => anim.wrapper === dateRef.current))}
          >
            <div className="nav-icon lottie-icon" ref={dateRef}></div>
            <span className="nav-label">My day</span>
            <span className="badge">1</span>
          </li>
          
          <li 
            className={`nav-item ${activeItem === 'Next 7 days' ? 'active' : ''}`}
            onClick={() => handleItemClick('Next 7 days')}
            onMouseEnter={() => handleItemHover(lottie.getRegisteredAnimations().find(anim => anim.wrapper === calendarRef.current))}
          >
            <div className="nav-icon lottie-icon" ref={calendarRef}></div>
            <span className="nav-label">Next 7 days</span>
            <span className="badge">7</span>
          </li>
          
          <li 
            className={`nav-item ${activeItem === 'All my tasks' ? 'active' : ''}`}
            onClick={() => handleItemClick('All my tasks')}
            onMouseEnter={() => handleItemHover(lottie.getRegisteredAnimations().find(anim => anim.wrapper === taskRef.current))}
          >
            <div className="nav-icon lottie-icon" ref={taskRef}></div>
            <span className="nav-label">All my tasks</span>
            <span className="badge">7</span>
          </li>
          
          <li 
            className={`nav-item ${activeItem === 'My Calendar' ? 'active' : ''}`}
            onClick={() => handleItemClick('My Calendar')}
            onMouseEnter={() => handleItemHover(lottie.getRegisteredAnimations().find(anim => anim.wrapper === calendarRef.current))}
          >
            <div className="nav-icon lottie-icon" ref={calendarRef}></div>
            <span className="nav-label">My Calendar</span>
            <span className="badge beta">Beta</span>
          </li>
          
          <li 
            className={`nav-item ${activeItem === 'Completed tasks' ? 'active' : ''}`}
            onClick={() => handleItemClick('Completed tasks')}
            onMouseEnter={() => handleItemHover(lottie.getRegisteredAnimations().find(anim => anim.wrapper === taskRef.current))}
          >
            <div className="nav-icon lottie-icon" ref={taskRef}></div>
            <span className="nav-label">Completed tasks</span>
          </li>
        </ul>
      </div>
      
      <button className="create-view">
        <span>+</span> Create a view
      </button>
      
      <div className="lists-section">
        <div className="lists-header">
          <h3>My lists</h3>
          <button className="add-list" onClick={handleAddListClick}>+</button>
        </div>
        <ul>
          {lists.map((list, index) => (
            <li 
              key={index}
              className={`list-item ${activeItem === list.name ? 'active' : ''}`}
              onClick={() => handleListClick(list.name)}
            >
              <div className="nav-icon lottie-icon" ref={index === 0 ? bookRef : null}></div>
              <span className="list-label">{list.name}</span>
              {list.count > 0 && <span className="badge">{list.count}</span>}
            </li>
          ))}
          
          {showNewListInput && (
            <li className="list-item new-list-form">
              <form onSubmit={handleCreateList}>
                <input
                  ref={newListInputRef}
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Enter list name"
                  className="new-list-input"
                />
                <div className="new-list-actions">
                  <button type="submit" className="create-list-btn">Create</button>
                  <button type="button" className="cancel-list-btn" onClick={handleCancelNewList}>Cancel</button>
                </div>
              </form>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
