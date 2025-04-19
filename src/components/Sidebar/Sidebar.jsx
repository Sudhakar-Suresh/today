import React, { useState, useEffect, useRef } from 'react';
import lottie from 'lottie-web';
import './Sidebar.css';
// Import Font Awesome components
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import AddListPopup from '../AddListPopup/AddListPopup';

// Import animation data
import settingData from '../../assets/sidebar/setting.json';
import calendarData from '../../assets/sidebar/calendar.json';
import dateData from '../../assets/sidebar/date.json';
import taskData from '../../assets/sidebar/task.json';
import bookData from '../../assets/sidebar/book.json';
import homeData from '../../assets/sidebar/home.json';

const Sidebar = ({ onPageChange, onAddList, userLists = [], activeItem = 'My day', onListSelect, onSidebarToggle, taskCounts = {} }) => {
  // Create refs for each icon
  const settingRef = useRef(null);
  const calendarRef = useRef(null);
  const dateRef = useRef(null);
  const taskRef = useRef(null);
  const bookRef = useRef(null);
  const homeRef = useRef(null);
  const sidebarRef = useRef(null);
  
  // Store animation references
  const animationsRef = useRef({});

  const [showNewListInput, setShowNewListInput] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const newListInputRef = useRef(null);
  const [showAddListPopup, setShowAddListPopup] = useState(false);

  // Create a ref array for list icons
  const listIconRefs = useRef([]);

  useEffect(() => {
    // Resize the refs array when userLists changes
    listIconRefs.current = userLists.map(() => ({
      ref: React.createRef(),
      animation: null
    }));
  }, [userLists]);

  useEffect(() => {
    // Initialize animations and store them in animationsRef
    animationsRef.current.setting = lottie.loadAnimation({
      container: settingRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: settingData
    });

    animationsRef.current.calendar = lottie.loadAnimation({
      container: calendarRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: calendarData
    });

    animationsRef.current.date = lottie.loadAnimation({
      container: dateRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: dateData
    });

    animationsRef.current.task = lottie.loadAnimation({
      container: taskRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: taskData
    });
    
    animationsRef.current.book = lottie.loadAnimation({
      container: bookRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: bookData
    });

    animationsRef.current.home = lottie.loadAnimation({
      container: homeRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: homeData
    });
    
    // Initialize animations for list icons
    listIconRefs.current.forEach((iconRef, index) => {
      if (iconRef.ref.current) {
        iconRef.animation = lottie.loadAnimation({
          container: iconRef.ref.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: bookData
        });
      }
    });
    
    // Clean up animations on unmount
    return () => {
      Object.values(animationsRef.current).forEach(anim => {
        if (anim) anim.destroy();
      });
      // Clean up list icon animations
      listIconRefs.current.forEach(iconRef => {
        if (iconRef.animation) {
          iconRef.animation.destroy();
        }
      });
    };
  }, [userLists]);

  // Focus on the input when it's shown
  useEffect(() => {
    if (showNewListInput && newListInputRef.current) {
      newListInputRef.current.focus();
    }
  }, [showNewListInput]);

  const handleItemHover = (animKey) => {
    const anim = animationsRef.current[animKey];
    if (anim) {
      anim.goToAndPlay(0);
    }
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
    setShowAddListPopup(true);
  };

  const handleCreateList = (listName) => {
    if (onAddList) {
      onAddList(listName);
    }
  };

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
    handleItemHover('setting');
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

  // Add a handler for list icon hover
  const handleListIconHover = (index) => {
    const iconRef = listIconRefs.current[index];
    if (iconRef && iconRef.animation) {
      iconRef.animation.goToAndPlay(0);
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
              onMouseEnter={() => handleItemHover('home')}
            >
              <div className="nav-icon lottie-icon" ref={homeRef}></div>
              <span className="nav-label">My day</span>
              {taskCounts.myDay > 0 && (
                <span className="badge">{taskCounts.myDay}</span>
              )}
            </li>
            
            <li 
              className={`nav-item ${activeItem === 'Next 7 days' ? 'active' : ''}`}
              onClick={() => handleItemClick('Next 7 days')}
              onMouseEnter={() => handleItemHover('date')}
            >
              <div className="nav-icon lottie-icon" ref={dateRef}></div>
              <span className="nav-label">Next 7 days</span>
              {taskCounts.next7Days > 0 && (
                <span className="badge">{taskCounts.next7Days}</span>
              )}
            </li>
            
            <li 
              className={`nav-item ${activeItem === 'All my tasks' ? 'active' : ''}`}
              onClick={() => handleItemClick('All my tasks')}
              onMouseEnter={() => handleItemHover('task')}
            >
              <div className="nav-icon lottie-icon" ref={taskRef}></div>
              <span className="nav-label">All my tasks</span>
              {taskCounts.allTasks > 0 && (
                <span className="badge">{taskCounts.allTasks}</span>
              )}
            </li>
            
            <li 
              className={`nav-item ${activeItem === 'My Calendar' ? 'active' : ''}`}
              onClick={() => handleItemClick('My Calendar')}
              onMouseEnter={() => handleItemHover('calendar')}
            >
              <div className="nav-icon lottie-icon" ref={calendarRef}></div>
              <span className="nav-label">My Calendar</span>
              <span className="badge beta">Beta</span>
            </li>
            
            <li 
              className={`nav-item ${activeItem === 'Completed tasks' ? 'active' : ''}`}
              onClick={() => handleItemClick('Completed tasks')}
              onMouseEnter={() => handleItemHover('book')}
            >
              <div className="nav-icon lottie-icon" ref={bookRef}></div>
              <span className="nav-label">Completed tasks</span>
              {taskCounts.completed > 0 && (
                <span className="badge">{taskCounts.completed}</span>
              )}
            </li>
          </ul>
        </div>
        
        <div className="lists-section">
          <div className="lists-header">
            <h3>MY LISTS</h3>
            <button className="add-list" onClick={handleAddListClick}>+</button>
          </div>
          <ul>
            {userLists.map((listName, index) => (
              <li 
                key={index}
                className={`list-item ${activeItem === listName ? 'active' : ''}`}
                onClick={() => handleListClick(listName)}
                onMouseEnter={() => handleListIconHover(index)}
              >
                <div 
                  className="nav-icon lottie-icon" 
                  ref={listIconRefs.current[index]?.ref}
                ></div>
                <span className="list-label">{listName}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {showAddListPopup && (
        <AddListPopup
          onClose={() => setShowAddListPopup(false)}
          onAdd={handleCreateList}
        />
      )}
    </>
  );
};

export default Sidebar;
