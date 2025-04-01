import React from 'react';
import './CompletedTasks.css';
import TaskCard from '../TaskCard/TaskCard';

const CompletedTasks = ({ tasks, onToggleComplete }) => {
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <div className="completed-tasks-content">
      <div className="completed-header">
        <h1>Completed Tasks</h1>
        <span className="completed-count">{completedTasks.length}</span>
      </div>
      
      {completedTasks.length === 0 ? (
        <div className="no-completed-tasks">
          <p>No completed tasks yet</p>
        </div>
      ) : (
        <div className="completed-tasks-list">
          {completedTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks; 