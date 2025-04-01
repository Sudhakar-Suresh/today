import React, { useState, useRef } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import calendarAnimation from '../../assets/sidebar/calendar.json';
import dateAnimation from '../../assets/sidebar/date.json';
import settingAnimation from '../../assets/sidebar/setting.json';
import './Sidebar.css';

const Sidebar = ({ activeView, onViewChange }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const settingRef = useRef(null);

  const menuItems = [
    { 
      id: 'my-day', 
      icon: dateAnimation, 
      label: 'My day', 
      badge: '1' 
    },
    { 
      id: 'next-7-days', 
      icon: calendarAnimation, 
      label: 'Next 7 days', 
      badge: '7' 
    },
    { 
      id: 'all-tasks', 
      icon: '📋', 
      label: 'All my tasks', 
      badge: '7' 
    },
    { 
      id: 'calendar', 
      icon: calendarAnimation, 
      label: 'My Calendar', 
      badge: 'beta' 
    },
    { 
      id: 'completed', 
      icon: '✓', 
      label: 'Completed tasks' 
    }
  ];

  return (
    <div className="sidebar">
      <div className="user-profile">
        <div
          className="profile-icon"
          onMouseEnter={() => settingRef.current?.play()}
          onMouseLeave={() => settingRef.current?.stop()}
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

      <div className="menu-section">
        {menuItems.map((item) => (
          <div
            key={item.id}
            className={`menu-item ${activeView === item.id ? 'active' : ''}`}
            onClick={() => onViewChange(item.id)}
            onMouseEnter={() => setHoveredIcon(item.id)}
            onMouseLeave={() => setHoveredIcon(null)}
          >
            {typeof item.icon === 'string' ? (
              <span className="menu-icon">{item.icon}</span>
            ) : (
              <Player
                src={item.icon}
                className="lottie-icon"
                autoplay={hoveredIcon === item.id}
                loop={hoveredIcon === item.id}
                style={{ width: '24px', height: '24px' }}
              />
            )}
            <span className="menu-label">{item.label}</span>
            {item.badge && <span className="menu-badge">{item.badge}</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
