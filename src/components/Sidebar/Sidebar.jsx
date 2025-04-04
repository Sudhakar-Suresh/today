import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './Sidebar.css';
// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';

// Import animation data
import settingData from '../../assets/sidebar/setting.json';
import calendarData from '../../assets/sidebar/calendar.json';
import dateData from '../../assets/sidebar/date.json';
import taskData from '../../assets/sidebar/task.json';
import bookData from '../../assets/sidebar/book.json';

const Sidebar = ({ onPageChange, onAddList, userLists = [], activeItem = 'My day', onListSelect, onSidebarToggle }) => {
  const settingRef = useRef(null);
  const calendarRef = useRef(null);
  const dateRef = useRef(null);
  const taskRef = useRef(null);
  const bookRef = useRef(null);
  const sidebarRef = useRef(null);
  
  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
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
    onPageChange(item);
  };

  const handleListClick = (listName) => {
    // Instead of changing the page, call a function to filter tasks by list
    if (onListSelect) {
      onListSelect(listName);
    }
  };

  const handleAddListClick = () => {
    setShowNewListInput(true);
  };

  const handleCreateList = (e) => {
    e.preventDefault();
    if (newListName.trim()) {
      console.log("Sidebar creating new list:", newListName.trim());
      // Call parent callback to add list
      if (onAddList) {
        onAddList(newListName.trim());
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

  // Notify parent of sidebar state changes
  useEffect(() => {
    if (onSidebarToggle) {
      onSidebarToggle(isExpanded);
    }
  }, [isExpanded, onSidebarToggle]);

  // Handle hover on settings icon
  const handleSettingsHover = () => {
    if (!isPinned) {
      setIsExpanded(true);
    }
    const settingAnim = lottie.getRegisteredAnimations().find(anim => anim.wrapper === settingRef.current);
    if (settingAnim) {
      settingAnim.goToAndPlay(0);
    }
  };

  // Handle mouse leave from sidebar
  const handleSidebarLeave = () => {
    if (!isPinned) {
      setIsExpanded(false);
    }
  };

  // Toggle pin state
  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsExpanded(true);
    }
  };

  return (
    <>
      {/* Floating settings icon that's always visible */}
      <div 
        className="floating-settings-icon"
        onMouseEnter={handleSettingsHover}
      >
        <span ref={settingRef}></span>
      </div>
      
      <div 
        className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'} ${isPinned ? 'pinned' : ''}`} 
        ref={sidebarRef}
        onMouseLeave={handleSidebarLeave}
      >
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="profile-icon">
              <span className="settings-icon"></span>
            </div>
            <div className="profile-info">
              <h3>Sudhakar</h3>
              <span className="subtitle">Workspace Account</span>
            </div>
            
            {/* Pin icon */}
            <button 
              className={`pin-button ${isPinned ? 'active' : ''}`} 
              onClick={togglePin}
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              <FontAwesomeIcon icon={faThumbtack} />
            </button>
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
        
        <div className="lists-section">
          <div className="lists-header">
            <h3>My lists</h3>
            <button className="add-list" onClick={handleAddListClick}>+</button>
          </div>
          <ul>
            {userLists.map((listName, index) => (
              <li 
                key={index}
                className={`list-item ${activeItem === listName ? 'active' : ''}`}
                onClick={() => handleListClick(listName)}
              >
                <div className="nav-icon lottie-icon" ref={index === 0 ? bookRef : null}></div>
                <span className="list-label">{listName}</span>
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
        
        <button className="create-view">
          <span>+</span> Create a view
        </button>
      </div>
    </>
  );
};

export default Sidebar;
