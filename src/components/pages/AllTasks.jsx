import React from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './AllTasks.css';

const AllTasks = ({ 
  tasks = [], 
  onToggleComplete, 
  onDelete, 
  onUpdateTags, 
  onUpdateList,
  onTogglePin,
  onUpdateReminder,
  availableLists = []
}) => {
  return (
    <div className="page-content all-tasks-page">
      <header className="header-section">
        <div className="greeting-container">
          <h1>All Tasks</h1>
          <p className="subtitle">View and manage all your tasks in one place</p>
        </div>
      </header>
      
      <div className="all-tasks-content">
        {tasks.length > 0 ? (
          <div className="tasks-area">
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                onUpdateTags={onUpdateTags}
                onUpdateList={onUpdateList}
                onTogglePin={onTogglePin}
                onUpdateReminder={onUpdateReminder}
                availableLists={availableLists}
              />
            ))}
          </div>
        ) : (
          <p className="no-tasks-message">You have no active tasks</p>
        )}
      </div>
    </div>
  );
};

export default AllTasks; 