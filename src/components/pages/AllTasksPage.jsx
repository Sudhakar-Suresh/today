import React, { useState, useRef, useEffect } from 'react';
import './AllTasksPage.css';

const AllTasksPage = () => {
  const [sections, setSections] = useState([
    {
      id: 'newgas',
      title: 'Newgas',
      tasks: [{ id: 1, text: 'asfd', progress: '20%' }]
    },
    {
      id: 'new',
      title: 'New',
      tasks: []
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [{ id: 2, text: 'sdafyhg', progress: '0%' }]
    }
  ]);

  const [currentView, setCurrentView] = useState('kanban');
  const [showViewPopup, setShowViewPopup] = useState(false);
  const viewPopupRef = useRef(null);
  const viewButtonRef = useRef(null);
  
  // Dragging state
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);
  const [dragOverSectionId, setDragOverSectionId] = useState(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewPopupRef.current && 
          !viewPopupRef.current.contains(event.target) && 
          viewButtonRef.current && 
          !viewButtonRef.current.contains(event.target)) {
        setShowViewPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const addTask = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newTask = {
          id: Date.now(),
          text: '',
          progress: '0%'
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
      title: 'New Section',
      tasks: []
    };
    setSections([...sections, newSection]);
  };

  // View change handler
  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowViewPopup(false);
  };

  // Add this to your component for the custom drag ghost in table view
  const [dragGhost, setDragGhost] = useState(null);

  // Updated task drag start handler
  const handleTaskDragStart = (e, sectionId, taskId) => {
    setDraggedTask({ sectionId, taskId });
    e.currentTarget.classList.add('dragging');
    
    // Get the task content
    const taskText = e.currentTarget.querySelector('.task-title-input').value;
    
    // Create custom drag ghost with slant effect
    const ghost = document.createElement('div');
    ghost.className = 'table-drag-ghost';
    ghost.innerText = taskText;
    ghost.style.transform = 'rotate(3deg)';
    
    document.body.appendChild(ghost);
    setDragGhost(ghost);
    
    // Set initial position off-screen
    ghost.style.left = '-1000px';
    ghost.style.top = '-1000px';
    
    // Set as drag image
    e.dataTransfer.setDragImage(ghost, 20, 20);
    
    // Update the ghost position during drag
    document.addEventListener('dragover', updateGhostPosition);
  };

  const updateGhostPosition = (e) => {
    if (dragGhost) {
      dragGhost.style.left = `${e.clientX + 15}px`;
      dragGhost.style.top = `${e.clientY + 15}px`;
    }
  };

  // Clean up the ghost when drag ends
  const handleTaskDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    
    if (dragGhost) {
      document.removeEventListener('dragover', updateGhostPosition);
      document.body.removeChild(dragGhost);
      setDragGhost(null);
    }
    
    setDraggedTask(null);
    setDragOverSectionId(null);
    
    // Remove drag-over styling
    document.querySelectorAll('.drop-zone-row').forEach(row => {
      row.classList.remove('drag-over');
    });
  };

  // Handle section drag with a different ghost effect
  const handleSectionDragStart = (e, sectionId) => {
    setDraggedSection(sectionId);
    e.currentTarget.classList.add('dragging');
    
    const sectionTitle = e.currentTarget.querySelector('.section-title').innerText;
    
    // Create custom drag ghost
    const ghost = document.createElement('div');
    ghost.className = 'table-drag-ghost section-ghost';
    ghost.innerText = `Section: ${sectionTitle}`;
    
    document.body.appendChild(ghost);
    setDragGhost(ghost);
    
    // Set initial position off-screen
    ghost.style.left = '-1000px';
    ghost.style.top = '-1000px';
    
    // Set as drag image
    e.dataTransfer.setDragImage(ghost, 20, 20);
    
    // Update the ghost position during drag
    document.addEventListener('dragover', updateGhostPosition);
  };

  // Update the section drag end handler
  const handleSectionDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    
    if (dragGhost) {
      document.removeEventListener('dragover', updateGhostPosition);
      document.body.removeChild(dragGhost);
      setDragGhost(null);
    }
    
    setDraggedSection(null);
  };

  const handleBoardDragOver = (e) => {
    e.preventDefault();
  };

  const handleSectionDrop = (e, targetIndex) => {
    e.preventDefault();
    if (!draggedSection) return;

    const sourceIndex = sections.findIndex(s => s.id === draggedSection);
    if (sourceIndex === targetIndex) return;

    // Reorder the sections
    setSections(prevSections => {
      const newSections = [...prevSections];
      const [movedSection] = newSections.splice(sourceIndex, 1);
      newSections.splice(targetIndex, 0, movedSection);
      return newSections;
    });
  };

  const renderKanbanView = () => {
    return (
      <div 
        className="kanban-board"
        onDragOver={handleBoardDragOver}
      >
        {sections.map((section, index) => (
          <div 
            key={section.id} 
            className="kanban-section"
            data-section-id={section.id}
            draggable
            onDragStart={(e) => handleSectionDragStart(e, section.id)}
            onDragEnd={handleSectionDragEnd}
            onDragOver={(e) => handleSectionDragOver(e, section.id)}
            onDrop={(e) => {
              if (draggedTask) {
                handleTaskDrop(e, section.id);
              } else if (draggedSection) {
                handleSectionDrop(e, index);
              }
            }}
          >
            <div className="section-header">
              <h2>{section.title}</h2>
              <div className="section-actions">
                <button className="section-menu-btn">•••</button>
              </div>
            </div>
            <div className="tasks-container">
              {section.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, section.id, task.id)}
                  onDragEnd={handleTaskDragEnd}
                >
                  <div className="task-content">
                    <input
                      type="text"
                      value={task.text}
                      onChange={(e) => updateTaskText(section.id, task.id, e.target.value)}
                      placeholder="Enter task..."
                      className="task-input"
                    />
                  </div>
                  {task.progress && (
                    <div className="task-footer">
                      <div className="task-progress">
                        <span className="progress-badge">{task.progress}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button 
              className="add-task-btn"
              onClick={() => addTask(section.id)}
            >
              + Add Task
            </button>
          </div>
        ))}
        
        {/* Add Section Button */}
        <button 
          className="add-section-btn" 
          onClick={addSection}
        >
          + Add section
        </button>
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <div className="table-view">
        <table className="tasks-table">
          <thead>
            <tr>
              <th className="th-title">TITLE</th>
              <th className="th-assignees">ASSIGNEES</th>
              <th className="th-start-date">START DATE</th>
              <th className="th-due-date">DUE DATE</th>
              <th className="th-duration">DURATION</th>
              <th className="th-tags">TAGS</th>
              <th className="th-attachments">ATTACHMENTS</th>
              <th className="th-progress">PROGRESS</th>
              <th className="th-add">
                <button className="add-column-btn">+</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section, sectionIndex) => (
              <React.Fragment key={section.id}>
                <tr 
                  className="section-row"
                  draggable
                  onDragStart={(e) => handleSectionDragStart(e, section.id)}
                  onDragEnd={handleSectionDragEnd}
                >
                  <td 
                    colSpan="9" 
                    className="section-cell"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      if (draggedSection) {
                        handleSectionDrop(e, sectionIndex);
                      }
                    }}
                  >
                    <span className="section-drag-handle">≡</span>
                    <span className="section-title">{section.title}</span>
                  </td>
                </tr>
                
                {section.tasks.map(task => (
                  <tr 
                    key={task.id} 
                    className="task-row"
                    draggable
                    onDragStart={(e) => handleTaskDragStart(e, section.id, task.id)}
                    onDragEnd={handleTaskDragEnd}
                  >
                    <td 
                      className="task-title-cell"
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <input
                        type="text"
                        value={task.text}
                        onChange={(e) => updateTaskText(section.id, task.id, e.target.value)}
                        className="task-title-input"
                        placeholder="Enter task..."
                      />
                      <span className="task-drag-handle">⋮⋮</span>
                    </td>
                    <td className="task-assignees">
                      {section.id === 'newgas' && <div className="assignee-icon">👤</div>}
                    </td>
                    <td className="task-start-date">
                      {section.id === 'newgas' && <div className="date-icon">📅</div>}
                    </td>
                    <td className="task-due-date"></td>
                    <td className="task-duration">
                      {section.id === 'newgas' ? '4.9.25' : ''}
                    </td>
                    <td className="task-tags">
                      {section.id === 'newgas' && <div className="tag-icon">#</div>}
                    </td>
                    <td className="task-attachments">
                      {section.id === 'newgas' && <div className="attachment-icon">📎</div>}
                    </td>
                    <td className="task-progress">
                      <div className="progress-pill">
                        <span className="progress-text">{task.progress || '0%'}</span>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                ))}
                
                {/* Drop Zone Row for Tasks */}
                <tr 
                  className={`drop-zone-row ${draggedTask && draggedTask.sectionId !== section.id ? 'active' : ''}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('drag-over');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('drag-over');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('drag-over');
                    if (draggedTask && draggedTask.sectionId !== section.id) {
                      handleTaskDrop(e, section.id);
                    }
                  }}
                >
                  <td colSpan="9" className="drop-zone-cell">
                    <div className="drop-zone-message">Drop task here</div>
                  </td>
                </tr>
                
                <tr className="add-task-row">
                  <td colSpan="9" className="add-task-cell">
                    <button 
                      className="add-task-btn"
                      onClick={() => addTask(section.id)}
                    >
                      <span className="plus-icon">+</span> Add task
                    </button>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        <div className="add-section-container">
          <button 
            className="add-section-btn"
            onClick={addSection}
          >
            <span className="plus-icon">+</span> Add section
          </button>
        </div>
      </div>
    );
  };

  // Rendering different views
  const renderCurrentView = () => {
    switch(currentView) {
      case 'table':
        return renderTableView();
      case 'kanban':
      default:
        return renderKanbanView();
    }
  };

  // Add a DragPreview component to the main component

  const DragPreview = ({ task, isVisible }) => {
    if (!isVisible) return null;
    
    return (
      <div className="drag-preview">
        <div className="preview-card">
          <div className="preview-content">{task.text}</div>
          {task.progress && (
            <div className="preview-progress">
              <span className="preview-badge">{task.progress}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Add state to track mouse position
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Add useEffect to track mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggedTask) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [draggedTask]);

  // Get the dragged task details for the preview
  const draggedTaskDetails = draggedTask 
    ? sections.find(s => s.id === draggedTask.sectionId)?.tasks.find(t => t.id === draggedTask.taskId)
    : null;

  return (
    <div className="kanban-page">
      {/* Header */}
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
              <button 
                className={`header-btn ${showViewPopup ? 'active' : ''}`}
                onClick={() => setShowViewPopup(!showViewPopup)}
                ref={viewButtonRef}
              >
                <span className="btn-icon">👁️</span>
                <span>View</span>
              </button>
              
              {/* View Popup */}
              {showViewPopup && (
                <div className="view-popup" ref={viewPopupRef}>
                  <div className="popup-header">
                    <h3>View options</h3>
                  </div>
                  <div className="view-options">
                    <div 
                      className={`view-option ${currentView === 'kanban' ? 'active' : ''}`}
                      onClick={() => handleViewChange('kanban')}
                    >
                      <div className="option-icon">📊</div>
                      <div className="option-details">
                        <div className="option-name">Kanban</div>
                        <div className="option-description">Board view with columns</div>
                      </div>
                      {currentView === 'kanban' && <div className="option-check">✓</div>}
                    </div>
                    
                    <div 
                      className={`view-option ${currentView === 'table' ? 'active' : ''}`}
                      onClick={() => handleViewChange('table')}
                    >
                      <div className="option-icon">🗒️</div>
                      <div className="option-details">
                        <div className="option-name">Table</div>
                        <div className="option-description">Spreadsheet-like view</div>
                      </div>
                      {currentView === 'table' && <div className="option-check">✓</div>}
                    </div>
                  </div>
                </div>
              )}
              
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

      {/* Current View */}
      {renderCurrentView()}

      {draggedTask && draggedTaskDetails && (
        <DragPreview 
          task={draggedTaskDetails} 
          isVisible={true}
          style={{
            position: 'fixed',
            left: mousePosition.x + 15,
            top: mousePosition.y + 15,
            pointerEvents: 'none',
            zIndex: 9999
          }}
        />
      )}
    </div>
  );
};

export default AllTasksPage; 