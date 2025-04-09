import React, { useState, useRef, useEffect } from 'react';
import './AllTasksPage.css';

const AllTasksPage = () => {
  // Initial data state
  const [sections, setSections] = useState([
    {
      id: 'newgas',
      title: 'Newgas',
      tasks: [{ id: 1, text: 'asfd', progress: '20%', assignee: '', startDate: '', dueDate: '', duration: '4.9.25', tags: '', attachments: [] }]
    },
    {
      id: 'new',
      title: 'New',
      tasks: []
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [{ id: 2, text: 'sdafyhg', progress: '0%', assignee: '', startDate: '', dueDate: '', duration: '', tags: '', attachments: [] }]
    }
  ]);

  // State for view management and UI interactions
  const [currentView, setCurrentView] = useState('kanban');
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);
  const [dragGhost, setDragGhost] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  
  // Refs
  const viewPopupRef = useRef(null);
  const viewButtonRef = useRef(null);
  const editSectionInputRef = useRef(null);

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

  // Focus edit input when editing section title
  useEffect(() => {
    if (editingSectionId && editSectionInputRef.current) {
      editSectionInputRef.current.focus();
    }
  }, [editingSectionId]);

  // Task Management Functions
  const addTask = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        const newTask = {
          id: Date.now(),
          text: '',
          progress: '0%',
          assignee: '',
          startDate: '',
          dueDate: '',
          duration: '',
          tags: '',
          attachments: []
        };
        return {
          ...section,
          tasks: [...section.tasks, newTask]
        };
      }
      return section;
    }));
  };

  const updateTask = (sectionId, taskId, updates) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          )
        };
      }
      return section;
    }));
  };

  const deleteTask = (sectionId, taskId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: section.tasks.filter(task => task.id !== taskId)
        };
      }
      return section;
    }));
  };

  // Section Management Functions
  const addSection = () => {
    const sectionName = prompt('Enter section name:', 'New Section');
    if (sectionName) {
      setSections([...sections, {
        id: `section-${Date.now()}`,
        title: sectionName,
        tasks: []
      }]);
    }
  };

  const updateSectionTitle = (sectionId, newTitle) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, title: newTitle } : section
    ));
    setEditingSectionId(null);
  };

  const startEditingSection = (sectionId) => {
    setEditingSectionId(sectionId);
  };

  const handleEditSectionKeyDown = (e, sectionId) => {
    if (e.key === 'Enter') {
      updateSectionTitle(sectionId, e.target.value);
    } else if (e.key === 'Escape') {
      setEditingSectionId(null);
    }
  };

  // View change handler
  const handleViewChange = (view) => {
    setCurrentView(view);
    setShowViewPopup(false);
  };

  // Drag and Drop Handlers for both views
  const handleTaskDragStart = (e, sectionId, taskId) => {
    setDraggedTask({ sectionId, taskId });
    e.currentTarget.classList.add('dragging');
    
    // Create custom drag ghost with slant effect
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost';
    
    // Get task text based on the view
    let taskText = '';
    if (currentView === 'kanban') {
      taskText = e.currentTarget.querySelector('input')?.value || 'Task';
    } else {
      taskText = e.currentTarget.querySelector('.task-title-input')?.value || 'Task';
    }
    
    ghost.textContent = taskText;
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

  const handleTaskDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
    
    if (dragGhost) {
      document.removeEventListener('dragover', updateGhostPosition);
      document.body.removeChild(dragGhost);
      setDragGhost(null);
    }
    
    setDraggedTask(null);
    
    // Remove drag-over styling
    if (currentView === 'kanban') {
      document.querySelectorAll('.kanban-section').forEach(section => {
        section.classList.remove('drag-over');
      });
    } else {
      document.querySelectorAll('.drop-zone-row').forEach(row => {
        row.classList.remove('drag-over');
      });
    }
  };

  const handleSectionDragStart = (e, sectionId) => {
    setDraggedSection(sectionId);
    e.currentTarget.classList.add('dragging-section');
    
    // Create custom drag ghost
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost section-ghost';
    
    // Get section title
    let sectionTitle = '';
    if (currentView === 'kanban') {
      sectionTitle = e.currentTarget.querySelector('h2')?.textContent || 'Section';
    } else {
      sectionTitle = e.currentTarget.querySelector('.section-title')?.textContent || 'Section';
    }
    
    ghost.textContent = `Section: ${sectionTitle}`;
    
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

  const handleSectionDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging-section');
    
    if (dragGhost) {
      document.removeEventListener('dragover', updateGhostPosition);
      document.body.removeChild(dragGhost);
      setDragGhost(null);
    }
    
    setDraggedSection(null);
  };

  const handleTaskDrop = (e, targetSectionId) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { sectionId: sourceSectionId, taskId } = draggedTask;
    
    // Don't do anything if dropping in the same section
    if (sourceSectionId === targetSectionId) return;

    // Move the task between sections
    setSections(prevSections => {
      const newSections = JSON.parse(JSON.stringify(prevSections));
      
      const sourceSection = newSections.find(s => s.id === sourceSectionId);
      const targetSection = newSections.find(s => s.id === targetSectionId);
      
      if (!sourceSection || !targetSection) return prevSections;
      
      const taskIndex = sourceSection.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevSections;
      
      const task = sourceSection.tasks[taskIndex];
      
      sourceSection.tasks.splice(taskIndex, 1);
      targetSection.tasks.push(task);
      
      return newSections;
    });
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSectionDragOver = (e, sectionId) => {
    e.preventDefault();
    
    if (draggedTask) {
      // Add visual feedback for task being dragged over a section
      document.querySelectorAll('.kanban-section').forEach(section => {
        if (section.getAttribute('data-section-id') === sectionId) {
          section.classList.add('drag-over');
        } else {
          section.classList.remove('drag-over');
        }
      });
    }
  };

  // Render Kanban View
  const renderKanbanView = () => {
    return (
      <div 
        className="kanban-board"
        onDragOver={handleDragOver}
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
              {editingSectionId === section.id ? (
                <input
                  ref={editSectionInputRef}
                  type="text"
                  className="section-title-input"
                  defaultValue={section.title}
                  onBlur={(e) => updateSectionTitle(section.id, e.target.value)}
                  onKeyDown={(e) => handleEditSectionKeyDown(e, section.id)}
                />
              ) : (
                <h2 onClick={() => startEditingSection(section.id)}>{section.title}</h2>
              )}
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
                      onChange={(e) => updateTask(section.id, task.id, { text: e.target.value })}
                      placeholder="Enter task..."
                      className="task-input"
                    />
                  </div>
                  {task.progress && (
                    <div className="task-footer">
                      <div className="task-progress">
                        <span className="progress-badge">{task.progress}</span>
                      </div>
                      <button 
                        className="task-delete-btn"
                        onClick={() => deleteTask(section.id, task.id)}
                      >
                        🗑️
                      </button>
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

  // Render Table View
  const renderTableView = () => {
    return (
      <div className="table-view">
        <div className="table-container">
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
          </table>
        </div>

        {/* Section Cards */}
        <div className="section-cards">
          {/* Newgas Card */}
          <div className="section-card">
            <div className="section-header">Newgas</div>
            <table className="section-table">
              <tbody>
                <tr className="task-row">
                  <td className="task-title-cell">asfd</td>
                  <td className="task-assignees">
                    <div className="cell-icon assignee-icon">👤</div>
                  </td>
                  <td className="task-start-date">
                    <div className="cell-icon date-icon">📅</div>
                  </td>
                  <td className="task-due-date"></td>
                  <td className="task-duration">4.9.25</td>
                  <td className="task-tags">
                    <div className="cell-icon tag-icon">#</div>
                  </td>
                  <td className="task-attachments">
                    <div className="cell-icon attachment-icon">📎</div>
                  </td>
                  <td className="task-progress">
                    <div className="progress-pill">
                      <span className="progress-text">20%</span>
                    </div>
                  </td>
                  <td className="task-actions"></td>
                </tr>
              </tbody>
            </table>
            <div className="add-task-wrapper">
              <button className="add-task-btn">
                <span className="plus-icon">+</span> Add task
              </button>
            </div>
          </div>

          {/* New Card */}
          <div className="section-card">
            <div className="section-header">New</div>
            <table className="section-table">
              <tbody>
                {/* No tasks */}
              </tbody>
            </table>
            <div className="add-task-wrapper">
              <button className="add-task-btn">
                <span className="plus-icon">+</span> Add task
              </button>
            </div>
          </div>

          {/* Completed Card */}
          <div className="section-card">
            <div className="section-header">Completed</div>
            <table className="section-table">
              <tbody>
                <tr className="task-row">
                  <td className="task-title-cell">sdafyhg</td>
                  <td className="task-assignees"></td>
                  <td className="task-start-date"></td>
                  <td className="task-due-date"></td>
                  <td className="task-duration"></td>
                  <td className="task-tags"></td>
                  <td className="task-attachments"></td>
                  <td className="task-progress">
                    <div className="progress-pill">
                      <span className="progress-text">0%</span>
                    </div>
                  </td>
                  <td className="task-actions"></td>
                </tr>
              </tbody>
            </table>
            <div className="add-task-wrapper">
              <button className="add-task-btn">
                <span className="plus-icon">+</span> Add task
              </button>
            </div>
          </div>
        </div>
        
        {/* Add Section Button */}
        <button className="add-section-btn">
          <span className="plus-icon">+</span> Add section
        </button>
      </div>
    );
  };

  // Render different views
  const renderCurrentView = () => {
    switch(currentView) {
      case 'table':
        return renderTableView();
      case 'kanban':
      default:
        return renderKanbanView();
    }
  };

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
    </div>
  );
};

export default AllTasksPage; 