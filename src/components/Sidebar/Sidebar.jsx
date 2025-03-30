import React, { useState, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import calendarAnimation from '../../assets/sidebar/calendar.json';
import dateAnimation from '../../assets/sidebar/date.json';
import settingAnimation from '../../assets/sidebar/setting.json';
import './Sidebar.css';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('my-day');
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const settingRef = useRef(null);

  const menuItems = [
    { id: 'my-day', icon: dateAnimation, label: 'My day', badge: '1' },
    { id: 'next-7-days', icon: calendarAnimation, label: 'Next 7 days', badge: '7' },
    { id: 'all-tasks', icon: '📋', label: 'All my tasks', badge: '7' },
    { id: 'calendar', icon: calendarAnimation, label: 'My Calendar', badge: 'beta' },
    { id: 'completed', icon: '✓', label: 'Completed tasks' },
  ];

  const lists = [
    { id: 'personal', label: 'Personal', badge: '6' },
    { id: 'work', label: 'Work' },
    { id: 'grocery', label: 'Grocery List' },
    { id: 'new', label: 'New', badge: '1' },
  ];

  return (
    <div className="sidebar">
      {/* User Profile */}
      <div className="user-profile">
        <div
          className="profile-icon"
          onMouseEnter={() => settingRef.current?.play()}  // Start animation on hover
          onMouseLeave={() => settingRef.current?.stop()} // Stop animation when hover ends
        >
          <Player
            ref={settingRef}
            src={settingAnimation}
            className="lottie-icon"
            style={{ width: '32px', height: '32px' }}
          />
        </div>
        <div className="profile-info">
          <h3>Sudhakar</h3>
          <p className="subtitle">Workspace Account</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="nav-menu">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => setActiveItem(item.id)}
              onMouseEnter={() => setHoveredIcon(item.id)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <span className="nav-icon">
                {typeof item.icon === 'string' ? (
                  item.icon
                ) : (
                  <Player
                    key={hoveredIcon === item.id ? `${item.id}-hover` : item.id}
                    src={item.icon}
                    className="lottie-icon"
                    autoplay={hoveredIcon === item.id}
                    loop={hoveredIcon === item.id}
                    style={{ width: '24px', height: '24px' }}
                  />
                )}
              </span>
              <span className="nav-label">{item.label}</span>
              {item.badge && (
                <span className={`badge ${item.badge === 'beta' ? 'beta' : ''}`}>
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* My Lists Section */}
      <div className="lists-section">
        <div className="lists-header">
          <h3>My lists</h3>
          <button className="add-list">+</button>
        </div>
        <ul>
          {lists.map((list) => (
            <li key={list.id} className="list-item">
              <span className="list-label">{list.label}</span>
              {list.badge && <span className="badge">{list.badge}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
