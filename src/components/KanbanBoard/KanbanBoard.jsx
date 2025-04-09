import React, { useState } from 'react';
import './KanbanBoard.css';

const KanbanBoard = () => {
  const [sections, setSections] = useState([
    {
      id: 'new1',
      title: 'New',
      tasks: [
        { id: 1, text: 'sdafyhg' }
      ]
    },
    {
      id: 'new2',
      title: 'New',
      tasks: [
        { id: 2, text: 'asfd' }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: []
    }
  ]);

  const addTask = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: [...section.tasks, { id: Date.now(), text: '' }]
        };
      }
      return section;
    }));
  };

  return (
    <div className="kanban-board">
      {sections.map(section => (
        <div key={section.id} className="kanban-section">
          <h2>{section.title}</h2>
          <div className="tasks-container">
            {section.tasks.map(task => (
              <div key={task.id} className="task-card">
                {task.text}
              </div>
            ))}
          </div>
          <button 
            className="add-task-button"
            onClick={() => addTask(section.id)}
          >
            + Add Task
          </button>
        </div>
      ))}
      <div className="add-section">
        + Add section
      </div>
    </div>
  );
};

export default KanbanBoard; 