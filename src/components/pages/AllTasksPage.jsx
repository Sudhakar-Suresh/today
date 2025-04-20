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

  // Create state for column visibility outside the render function
  const [tableColumns] = useState([
    { key: 'text', label: 'Task' },
    { key: 'progress', label: 'Progress' },
    { key: 'assignee', label: 'Assignee' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'duration', label: 'Duration' },
    { key: 'tags', label: 'Tags' },
    { key: 'actions', label: 'Actions' },
  ]);
  const [visibleColumns, setVisibleColumns] = useState(['text', 'progress', 'assignee', 'dueDate', 'actions']);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

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
    
    // Create a simple transparent drag image instead of a visible popup
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost hidden-ghost';
    
    // Add minimal styling for the ghost element but keep it invisible
    ghost.style.width = '1px';
    ghost.style.height = '1px';
    ghost.style.opacity = '0.01'; // Nearly invisible but still exists for technical reasons
    
    document.body.appendChild(ghost);
    setDragGhost(ghost);
    
    // Set drag image to the invisible element
    e.dataTransfer.setDragImage(ghost, 0, 0);
    
    // No need to update ghost position during drag since it's invisible
    // Remove the event listener that tracks cursor position
    document.removeEventListener('dragover', updateGhostPosition);
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
    
    // Create invisible drag ghost
    const ghost = document.createElement('div');
    ghost.className = 'drag-ghost hidden-ghost';
    ghost.style.width = '1px';
    ghost.style.height = '1px';
    ghost.style.opacity = '0.01';
    
    document.body.appendChild(ghost);
    setDragGhost(ghost);
    
    // Set as invisible drag image
    e.dataTransfer.setDragImage(ghost, 0, 0);
    
    // Remove event listener for position tracking
    document.removeEventListener('dragover', updateGhostPosition);
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

  // Fixed table view implementation
  const renderTableView = () => {
    const toggleColumn = (columnKey) => {
      if (visibleColumns.includes(columnKey)) {
        setVisibleColumns(visibleColumns.filter(key => key !== columnKey));
      } else {
        setVisibleColumns([...visibleColumns, columnKey]);
      }
    };
    
    return (
      <div className="table-view">
        <div className="table-controls">
          <button 
            className="column-selector-btn"
            onClick={() => setShowColumnSelector(!showColumnSelector)}
          >
            <span className="btn-icon">⚙</span>
            <span>Columns</span>
          </button>
          
          {showColumnSelector && (
            <div className="column-selector">
              {tableColumns.map(column => (
                <div key={column.key} className="column-option">
                  <input
                    type="checkbox"
                    id={`column-${column.key}`}
                    checked={visibleColumns.includes(column.key)}
                    onChange={() => toggleColumn(column.key)}
                  />
                  <label htmlFor={`column-${column.key}`}>{column.label}</label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="table-wrapper">
          {sections.map(section => (
            <div key={section.id} className="section-table">
              <div className="section-header">
                {editingSectionId === section.id ? (
                  <input
                    ref={editSectionInputRef}
                    type="text"
                    defaultValue={section.title}
                    onKeyDown={(e) => handleEditSectionKeyDown(e, section.id)}
                    onBlur={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="section-title-input"
                  />
                ) : (
                  <h3 
                    className="section-title" 
                    onClick={() => startEditingSection(section.id)}
                  >
                    {section.title}
                  </h3>
                )}
              </div>
              
              <div className="table-content">
                {/* Simple table header */}
                <div className="table-header">
                  {visibleColumns.map(colKey => {
                    const column = tableColumns.find(col => col.key === colKey);
                    return column ? (
                      <div key={colKey} className="header-cell">
                        {column.label}
                      </div>
                    ) : null;
                  })}
                </div>
                
                {/* Table rows */}
                <div className="table-body">
                  {section.tasks.length > 0 ? (
                    section.tasks.map(task => (
                      <div 
                        key={task.id} 
                        className="table-row"
                        draggable
                        onDragStart={(e) => handleTaskDragStart(e, section.id, task.id)}
                        onDragEnd={handleTaskDragEnd}
                      >
                        {visibleColumns.includes('text') && (
                          <div className="table-cell">
                            <input
                              type="text"
                              value={task.text || ''}
                              onChange={(e) => updateTask(section.id, task.id, { text: e.target.value })}
                              placeholder="Task name"
                            />
                          </div>
                        )}
                        
                        {visibleColumns.includes('progress') && (
                          <div className="table-cell">
                            <select 
                              value={task.progress || '0%'}
                              onChange={(e) => updateTask(section.id, task.id, { progress: e.target.value })}
                            >
                              <option value="0%">0%</option>
                              <option value="25%">25%</option>
                              <option value="50%">50%</option>
                              <option value="75%">75%</option>
                              <option value="100%">100%</option>
                            </select>
                          </div>
                        )}
                        
                        {visibleColumns.includes('assignee') && (
                          <div className="table-cell">
                            <input
                              type="text"
                              value={task.assignee || ''}
                              onChange={(e) => updateTask(section.id, task.id, { assignee: e.target.value })}
                              placeholder="Assignee"
                            />
                          </div>
                        )}
                        
                        {visibleColumns.includes('startDate') && (
                          <div className="table-cell">
                            <input
                              type="date"
                              value={task.startDate || ''}
                              onChange={(e) => updateTask(section.id, task.id, { startDate: e.target.value })}
                            />
                          </div>
                        )}
                        
                        {visibleColumns.includes('dueDate') && (
                          <div className="table-cell">
                            <input
                              type="date"
                              value={task.dueDate || ''}
                              onChange={(e) => updateTask(section.id, task.id, { dueDate: e.target.value })}
                            />
                          </div>
                        )}
                        
                        {visibleColumns.includes('duration') && (
                          <div className="table-cell">
                            <input
                              type="text"
                              value={task.duration || ''}
                              onChange={(e) => updateTask(section.id, task.id, { duration: e.target.value })}
                              placeholder="Duration"
                            />
                          </div>
                        )}
                        
                        {visibleColumns.includes('tags') && (
                          <div className="table-cell">
                            <input
                              type="text"
                              value={task.tags || ''}
                              onChange={(e) => updateTask(section.id, task.id, { tags: e.target.value })}
                              placeholder="Tags"
                            />
                          </div>
                        )}
                        
                        {visibleColumns.includes('actions') && (
                          <div className="table-cell action-cell">
                            <button 
                              className="task-delete-btn"
                              onClick={() => deleteTask(section.id, task.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="empty-section">
                      <p>No tasks in this section</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="section-footer">
                <button 
                  className="add-task-btn"
                  onClick={() => addTask(section.id)}
                >
                  + Add Task
                </button>
              </div>
            </div>
          ))}
          
          <button className="add-section-btn" onClick={addSection}>
            + Add Section
          </button>
        </div>
      </div>
    );
  };

  // Add a new renderCardView function
  const renderCardView = () => {
    return (
      <div className="card-view-container">
        {sections.map(section => (
          <div key={section.id} className="card-section">
            <div className="card-section-header">
              {editingSectionId === section.id ? (
                <input
                  ref={editSectionInputRef}
                  type="text"
                  defaultValue={section.title}
                  onKeyDown={(e) => handleEditSectionKeyDown(e, section.id)}
                  onBlur={(e) => updateSectionTitle(section.id, e.target.value)}
                  className="section-title-input"
                />
              ) : (
                <h2 
                  className="section-title" 
                  onClick={() => startEditingSection(section.id)}
                >
                  {section.title}
                </h2>
              )}
            </div>

            <div className="card-tasks-container">
              {section.tasks.map(task => (
                <div 
                  key={task.id} 
                  className="task-card"
                  draggable
                  onDragStart={(e) => handleTaskDragStart(e, section.id, task.id)}
                  onDragEnd={handleTaskDragEnd}
                >
                  <div className="task-card-header">
                    <input
                      type="text"
                      className="task-title-input"
                      value={task.text || ''}
                      onChange={(e) => updateTask(section.id, task.id, { text: e.target.value })}
                      placeholder="Task title"
                    />
                    <div className="task-card-actions">
                      <button onClick={() => deleteTask(section.id, task.id)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <div className="task-card-body">
                    <div className="task-card-field">
                      <span className="field-label">Progress:</span>
                      <select 
                        value={task.progress || '0%'}
                        onChange={(e) => updateTask(section.id, task.id, { progress: e.target.value })}
                      >
                        <option value="0%">0%</option>
                        <option value="25%">25%</option>
                        <option value="50%">50%</option>
                        <option value="75%">75%</option>
                        <option value="100%">100%</option>
                      </select>
                    </div>
                    
                    <div className="task-card-field">
                      <span className="field-label">Assignee:</span>
                      <input
                        type="text"
                        value={task.assignee || ''}
                        onChange={(e) => updateTask(section.id, task.id, { assignee: e.target.value })}
                        placeholder="Assignee"
                      />
                    </div>
                    
                    <div className="task-card-dates">
                      <div className="task-card-field">
                        <span className="field-label">Due:</span>
                        <input
                          type="date"
                          value={task.dueDate || ''}
                          onChange={(e) => updateTask(section.id, task.id, { dueDate: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                className="add-task-button" 
                onClick={() => addTask(section.id)}
              >
                + Add Task
              </button>
            </div>
          </div>
        ))}
        
        <button className="add-section-button" onClick={addSection}>
          + Add Section
        </button>
      </div>
    );
  };

  // Update the renderCurrentView function to include the card view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'kanban':
        return renderKanbanView();
      case 'table':
        return renderTableView();
      case 'card':
        return renderCardView();
      default:
        return renderKanbanView();
    }
  };

  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="kanban-header">
        <div className="header-container">
          
          <div className="header-title-container">
            <div className="title-icon">|||</div>
            <h1 className="project-title">My Tasks</h1>
            
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
                    <div 
                      className={`view-option ${currentView === 'card' ? 'active' : ''}`}
                      onClick={() => handleViewChange('card')}
                    >
                      <div className="option-icon">🗂️</div>
                      <div className="option-details">
                        <div className="option-name">Card</div>
                        <div className="option-description">Card view</div>
                      </div>
                      {currentView === 'card' && <div className="option-check">✓</div>}
                    </div>
                  </div>
                </div>
              )}
              
              
              
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