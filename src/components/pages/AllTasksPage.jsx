import React, { useState, useRef, useEffect } from 'react';
import AddTaskButton from '../AddTaskButton/AddTaskButton';
import TaskMenu from '../TaskMenu/TaskMenu';
import './AllTasksPage.css';

const AllTasksPage = () => {
  // Initial data state with sections from the image
  const [sections, setSections] = useState([
    {
      id: 'newsdfzg',
      title: 'Newsdfzg',
      tasks: []
    },
    {
      id: 'newgas',
      title: 'Newgas',
      tasks: [
        { id: 1, text: 'asfd', progress: '', assignee: '', startDate: '', dueDate: '', duration: '4.9.25', tags: '', attachments: [] }
      ]
    },
    {
      id: 'completed',
      title: 'Completed',
      tasks: [
        { id: 2, text: 'sdafyhg', progress: '', assignee: '', startDate: '', dueDate: '', duration: '', tags: '', attachments: [] }
      ]
    }
  ]);

  // State for view management and UI interactions
  const [currentView, setCurrentView] = useState('kanban');
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [draggedSection, setDraggedSection] = useState(null);
  const [dragGhost, setDragGhost] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [activeTaskMenu, setActiveTaskMenu] = useState(null);
  
  // Refs
  const viewPopupRef = useRef(null);
  const viewButtonRef = useRef(null);
  const editSectionInputRef = useRef(null);
  const taskMenuRef = useRef(null);

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

  // Modify the useEffect for clicking outside to use this ref
  useEffect(() => {
    // Close task menu when clicking outside
    const handleMenuClickOutside = (e) => {
      if (activeTaskMenu && 
          taskMenuRef.current && 
          !taskMenuRef.current.contains(e.target) && 
          !e.target.closest('.task-action-btn')) {
        setActiveTaskMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleMenuClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleMenuClickOutside);
    };
  }, [activeTaskMenu]);

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

  // Handle adding a task from the AddTaskButton component
  const handleAddTask = (sectionId, newTask) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          tasks: [...section.tasks, { 
            id: newTask.id || Date.now(),
            text: newTask.title || '',
            progress: '0%',
            assignee: '',
            startDate: '',
            dueDate: newTask.dueDate || '',
            duration: '',
            tags: '',
            attachments: []
          }]
        };
      }
      return section;
    }));
  };

  // Modify the handleTaskMenuToggle function to prevent event propagation issues
  const handleTaskMenuToggle = (sectionId, taskId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Toggle menu visibility
    if (activeTaskMenu && activeTaskMenu.sectionId === sectionId && activeTaskMenu.taskId === taskId) {
      setActiveTaskMenu(null);
    } else {
      setActiveTaskMenu({ sectionId, taskId });
    }
  };

  const handleCloseTaskMenu = () => {
    setActiveTaskMenu(null);
  };

  const handleMarkComplete = (sectionId, taskId) => {
    // Find completed section
    const completedSection = sections.find(section => section.id === 'completed');
    
    if (completedSection) {
      // Move task to completed section
      setSections(prevSections => {
        const newSections = JSON.parse(JSON.stringify(prevSections));
        
        // Find source section and task
        const sourceSection = newSections.find(s => s.id === sectionId);
        const taskIndex = sourceSection.tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex === -1) return prevSections;
        
        // Get the task and remove it from source
        const task = sourceSection.tasks[taskIndex];
        sourceSection.tasks.splice(taskIndex, 1);
        
        // Add task to completed section
        const targetSection = newSections.find(s => s.id === 'completed');
        targetSection.tasks.push(task);
        
        return newSections;
      });
    }
    
    setActiveTaskMenu(null);
  };

  const handleRemoveFromMyDay = (sectionId, taskId) => {
    // This would remove the task from My Day view if implemented
    console.log('Remove from My Day:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleSetDueDate = (sectionId, taskId) => {
    // This would open a date picker for setting due date
    console.log('Set due date:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleAssign = (sectionId, taskId) => {
    // This would open an assignee selector
    console.log('Assign:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleComment = (sectionId, taskId) => {
    // This would open a comment input
    console.log('Comment:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleAddTags = (sectionId, taskId) => {
    // This would open a tag selector
    console.log('Add tags:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleTrackTime = (sectionId, taskId) => {
    // This would open a time tracking input
    console.log('Track time:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleDuplicate = (sectionId, taskId) => {
    // Duplicate the task in the same section
    setSections(prevSections => {
      const newSections = JSON.parse(JSON.stringify(prevSections));
      const section = newSections.find(s => s.id === sectionId);
      
      if (!section) return prevSections;
      
      const taskIndex = section.tasks.findIndex(t => t.id === taskId);
      if (taskIndex === -1) return prevSections;
      
      const task = {...section.tasks[taskIndex], id: Date.now()};
      section.tasks.push(task);
      
      return newSections;
    });
    
    setActiveTaskMenu(null);
  };

  const handleCopyLink = (sectionId, taskId) => {
    // This would copy a link to the task
    console.log('Copy link:', sectionId, taskId);
    setActiveTaskMenu(null);
  };

  const handleArchive = (sectionId, taskId) => {
    // This would archive the task
    console.log('Archive:', sectionId, taskId);
    
    // For now, just delete the task
    deleteTask(sectionId, taskId);
    setActiveTaskMenu(null);
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

  // Update renderKanbanView with auto-expanding columns
  const renderKanbanView = () => {
    return (
      <div className="kanban-board">
        {sections.map((section) => (
          <div key={section.id} className="kanban-section auto-expand">
            <div className="section-header">
              <h2>{section.title}</h2>
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
                    <span>{task.text || "Untitled Task"}</span>
                    <div className="task-actions">
                      <button 
                        className="task-action-btn"
                        onClick={(e) => handleTaskMenuToggle(section.id, task.id, e)}
                      >
                        <span className="task-menu-icon">⋮</span>
                      </button>
                      <button 
                        className="task-delete-btn"
                        onClick={() => deleteTask(section.id, task.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  {task.duration && (
                    <div className="task-duration">
                      {task.duration}
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
        
        <button 
          className="add-section-btn" 
          onClick={addSection}
        >
          + Add section
        </button>
      </div>
    );
  };

  // Update the renderCurrentView function to set kanban as default
  const renderCurrentView = () => {
    switch (currentView) {
      case 'table':
        return renderTableView();
      case 'card':
        return renderCardView();
      case 'kanban':
      default:
        return renderKanbanView(); // Default to kanban view
    }
  };

  return (
    <div className="kanban-page">
      {/* Header */}
      <div className="kanban-header">
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
            <button className="header-btn">
              <span className="btn-icon">🔍</span>
              <span>Filter</span>
            </button>
            <button className="header-btn">
              <span className="btn-icon">⚡</span>
              <span>Automations</span>
            </button>
            <button className="header-btn">
              <span className="btn-icon">⋯</span>
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

      {/* Current View */}
      {renderCurrentView()}
      
      {/* Task Menu - rendered at root level */}
      {activeTaskMenu && (
        <TaskMenu
          onClose={handleCloseTaskMenu}
          onMarkComplete={() => handleMarkComplete(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onAddToDay={() => handleRemoveFromMyDay(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onSetDueDate={() => handleSetDueDate(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onAssign={() => handleAssign(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onComment={() => handleComment(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onAddTags={() => handleAddTags(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onTrackTime={() => handleTrackTime(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onDuplicate={() => handleDuplicate(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onCopyLink={() => handleCopyLink(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          onArchive={() => handleArchive(activeTaskMenu.sectionId, activeTaskMenu.taskId)}
          isInMyDay={true}
          ref={taskMenuRef}
        />
      )}
    </div>
  );
};

export default AllTasksPage; 