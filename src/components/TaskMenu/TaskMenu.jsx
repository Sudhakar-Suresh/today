import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./TaskMenu.css";

const TaskMenu = ({ 
  onClose, 
  onMarkComplete, 
  onAddToDay, 
  onSetDueDate, 
  onAssign, 
  onComment, 
  onAddTags, 
  onTrackTime, 
  onDuplicate, 
  onCopyLink, 
  onArchive,
  isInMyDay = true
}) => {
  const menuRef = useRef(null);
  
  // Handle clicks outside menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    // Use mousedown to catch the event before any potential glitches
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleAction = (callback) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (callback) callback();
  };

  return (
    <>
      {/* Backdrop to handle clicking outside */}
      <div className="task-menu-backdrop" onClick={onClose}></div>
      
      {/* Menu */}
      <div className="task-menu" ref={menuRef}>
        <button 
          className="task-menu-item"
          onClick={handleAction(onMarkComplete)}
        >
          <span className="task-menu-icon icon-complete"></span>
          Mark as Complete
        </button>
        
        <button 
          className="task-menu-item"
          onClick={handleAction(onAddToDay)}
        >
          <span className="task-menu-icon icon-remove"></span>
          {isInMyDay ? "Remove from My Day" : "Add to My Day"}
        </button>
        
        <button 
          className="task-menu-item"
          onClick={handleAction(onSetDueDate)}
        >
          <span className="task-menu-icon icon-date"></span>
          Due date
        </button>
        
        <button 
          className="task-menu-item"
          onClick={handleAction(onAssign)}
        >
          <span className="task-menu-icon icon-assign"></span>
          Assign
        </button>
        
        <button 
          className="task-menu-item"
          onClick={handleAction(onComment)}
        >
          <span className="task-menu-icon icon-comment"></span>
          Comment
        </button>
        
        <button 
          className="task-menu-item"
          onClick={handleAction(onAddTags)}
        >
          <span className="task-menu-icon icon-tags"></span>
          Tags
        </button>
        
        <button 
          className="task-menu-item"
          onClick={handleAction(onTrackTime)}
        >
          <span className="task-menu-icon icon-track"></span>
          Track time
        </button>
      </div>
    </>
  );
};

TaskMenu.propTypes = {
  onClose: PropTypes.func.isRequired,
  onMarkComplete: PropTypes.func,
  onAddToDay: PropTypes.func,
  onSetDueDate: PropTypes.func,
  onAssign: PropTypes.func,
  onComment: PropTypes.func,
  onAddTags: PropTypes.func,
  onTrackTime: PropTypes.func,
  onDuplicate: PropTypes.func,
  onCopyLink: PropTypes.func,
  onArchive: PropTypes.func,
  isInMyDay: PropTypes.bool
};

export default TaskMenu; 