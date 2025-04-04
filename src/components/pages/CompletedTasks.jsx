import React from 'react';
import './CompletedTasks.css';
import TaskCard from '../TaskCard/TaskCard';

const CompletedTasks = ({ 
  tasks = [], 
  onToggleComplete, 
  onDelete, 
  onUpdateTags, 
  onUpdateList,
  onTogglePin,
  onUpdateReminder,
  availableLists = [],
  listFilter = null,
  pageTitle = 'Completed Tasks'
}) => {
  return (
    <div className="page-content completed-tasks-page">
      <header className="header-section">
        <div className="greeting-container">
          <h1>{pageTitle}</h1>
          <p className="subtitle">
            {listFilter ? 
              `Completed tasks from your "${listFilter}" list` : 
              "Review what you've accomplished"}
          </p>
          {listFilter && (
            <div className="list-filter-badge">
              Filtered by: {listFilter}
            </div>
          )}
        </div>
      </header>
      
      <div className="completed-tasks-content">
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
          <p className="no-tasks-message">
            {listFilter ? 
              `You have no completed tasks in your "${listFilter}" list` : 
              "You have no completed tasks"}
          </p>
        )}
      </div>
    </div>
  );
};

export default CompletedTasks; 