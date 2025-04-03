import React from 'react';
import './CompletedTasks.css';
import TaskCard from '../TaskCard/TaskCard';

const CompletedTasks = ({ tasks, onDelete, onUpdateTags, onUpdateList, onToggleComplete, onTogglePin, onUpdateReminder }) => {
  return (
    <div className="page-content">
      <header className="header-section">
        <div className="greeting-container">
          <h1>Completed Tasks</h1>
          <p className="subtitle">Review what you've accomplished</p>
        </div>
      </header>
      
      <div className="completed-tasks-content">
        {tasks && tasks.length > 0 ? (
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
              />
            ))}
          </div>
        ) : (
          <p>Your completed tasks will appear here</p>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks; 