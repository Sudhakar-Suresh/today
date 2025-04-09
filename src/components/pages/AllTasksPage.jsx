import React, { useState, useRef } from 'react';
import './AllTasksPage.css';

const AllTasksPage = () => {
  const [sections, setSections] = useState([
    {
      id: 'new1',
      title: 'New',
      tasks: [{ id: 1, text: 'sdafyhg' }]
    },
    {
      id: 'new2',
      title: 'New',
      tasks: [{ id: 2, text: 'asfd' }]
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: []
    }
  ]);

  const [draggedItem, setDraggedItem] = useState(null);
  const dragNode = useRef();

  const addTask = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newTask = {
          id: Date.now(),
          text: ''
        };
        return {
          ...section,
          tasks: [...section.tasks, newTask]
        };
      }
      return section;
    }));
  };

  const updateTaskText = (sectionId, taskId, newText) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => 
            task.id === taskId ? { ...task, text: newText } : task
          )
        };
      }
      return section;
    }));
  };

  const addSection = () => {
    const newSection = {
      id: `section-${Date.now()}`,
      title: 'New',
      tasks: []
    };
    setSections([...sections, newSection]);
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, params) => {
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setDraggedItem(params);
    
    setTimeout(() => {
      dragNode.current.classList.add('dragging');
    }, 0);
  };

  const handleDragEnd = () => {
    dragNode.current.classList.remove('dragging');
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragNode.current = null;
    setDraggedItem(null);
  };

  const handleDragEnter = (e, params) => {
    const currentItem = draggedItem;
    
    if (e.target !== dragNode.current) {
      // Only update if the drop target is a different column than the drag source
      if (currentItem.sectionId !== params.sectionId) {
        setSections(prevSections => {
          // Create deep copy of the sections state
          let newSections = JSON.parse(JSON.stringify(prevSections));
          
          // Find the source section 
          const sourceSectionIndex = newSections.findIndex(
            s => s.id === currentItem.sectionId
          );
          
          // Find the task in the source section
          const taskIndex = newSections[sourceSectionIndex].tasks.findIndex(
            t => t.id === currentItem.taskId
          );
          
          // Get the task object
          const task = newSections[sourceSectionIndex].tasks[taskIndex];
          
          // Remove task from source section
          newSections[sourceSectionIndex].tasks.splice(taskIndex, 1);
          
          // Find target section
          const targetSectionIndex = newSections.findIndex(
            s => s.id === params.sectionId
          );
          
          // Add task to target section
          newSections[targetSectionIndex].tasks.push(task);
          
          return newSections;
        });
        
        // Update the draggedItem reference to the new section
        setDraggedItem({
          ...currentItem,
          sectionId: params.sectionId
        });
      }
    }
  };

  return (
    <div className="kanban-page">
      {/* Updated Header to match image */}
      <div className="kanban-header">
        <div className="header-container">
          <button className="settings-btn">
            <span className="settings-icon">⚙</span>
          </button>
          
          <div className="header-title-container">
            <div className="title-icon">|||</div>
            <h1 className="project-title">Test</h1>
            
            <div className="header-actions">
              <button className="header-btn">
                <span className="btn-icon">👤</span>
                <span>Share</span>
              </button>
              <button className="header-btn">
                <span className="btn-icon">👁️</span>
                <span>View</span>
              </button>
              <button className="header-btn">
                <span className="btn-icon">📋</span>
                <span>Filter</span>
              </button>
              <button className="header-btn">
                <span className="btn-icon">⚡</span>
                <span>Automations</span>
              </button>
              <button className="header-btn">•••</button>
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {sections.map(section => (
          <div 
            key={section.id} 
            className="kanban-section"
            onDragEnter={draggedItem ? (e) => handleDragEnter(e, { sectionId: section.id }) : null}
          >
            <div className="section-header">
              <h2>{section.title}</h2>
            </div>
            <div className="tasks-container">
              {section.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, { sectionId: section.id, taskId: task.id })}
                >
                  <input
                    type="text"
                    value={task.text}
                    onChange={(e) => updateTaskText(section.id, task.id, e.target.value)}
                    placeholder="Enter task..."
                  />
                </div>
              ))}
            </div>
            <button 
              className="add-task-btn"
              onClick={() => addTask(section.id)}
            >
              Add Task
            </button>
          </div>
        ))}
        
        {/* Add Section Button */}
        <button className="add-section-btn" onClick={addSection}>
          + Add section
        </button>
      </div>
    </div>
  );
};

export default AllTasksPage; 