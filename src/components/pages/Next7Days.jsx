import React from 'react';
import './Next7Days.css';
import TaskCard from '../TaskCard/TaskCard';

const Next7Days = ({ tasks, onToggleComplete, onDelete, onUpdateTags, onUpdateList }) => {
  return (
    <div className="next-7-days-content">
      <h1>Next 7 Days</h1>
      <div className="tasks-container">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDelete={onDelete}
            onUpdateTags={onUpdateTags}
            onUpdateList={onUpdateList}
          />
        ))}
      </div>
    </div>
  );
};

export default Next7Days; 