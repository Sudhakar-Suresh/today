import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './KanbanBoard.css';

// Helper function for reordering
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const KanbanBoard = ({ tasks = [] }) => {
  // Initial data structure
  const initialData = {
    tasks: {},
    columns: {
      'todo': {
        id: 'todo',
        title: 'To Do',
        taskIds: []
      },
      'inProgress': {
        id: 'inProgress',
        title: 'In Progress',
        taskIds: []
      },
      'completed': {
      id: 'completed',
      title: 'Completed',
        taskIds: []
      }
    },
    columnOrder: ['todo', 'inProgress', 'completed']
  };

  const [boardData, setBoardData] = useState(initialData);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editColumnId, setEditColumnId] = useState(null);
  const [columnTitle, setColumnTitle] = useState('');
  
  // Simple drag state for the board
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragHandleRef = useRef(null);
  
  // Initialize board with tasks if provided
  useEffect(() => {
    if (tasks && tasks.length > 0 && !isLoaded) {
      const taskMap = {};
      const newColumns = { ...boardData.columns };
      
      // Reset task IDs to avoid duplicates
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId].taskIds = [];
      });
      
      // Create task map and distribute to columns
      tasks.forEach(task => {
        const taskId = task.id.toString();
        taskMap[taskId] = {
          id: taskId,
          content: task.title || task.text || task.content || 'Untitled task',
          dueDate: task.dueDate || null
        };
        
        // Assign to columns based on status
        if (task.completed) {
          newColumns.completed.taskIds.push(taskId);
        } else if (task.inProgress) {
          newColumns.inProgress.taskIds.push(taskId);
        } else {
          newColumns.todo.taskIds.push(taskId);
        }
      });
      
      setBoardData({
        ...boardData,
        tasks: taskMap,
        columns: newColumns
      });
      setIsLoaded(true);
    } else if (tasks.length === 0 && !isLoaded) {
      // Initialize with empty data
      setBoardData(initialData);
      setIsLoaded(true);
    }
  }, [tasks, isLoaded]);

  // If not initialized with tasks, add some sample tasks
  useEffect(() => {
    if (isLoaded && Object.keys(boardData.tasks).length === 0) {
      const sampleTasks = {
        'task-1': { id: 'task-1', content: 'Create project plan', dueDate: new Date().toISOString() },
        'task-2': { id: 'task-2', content: 'Design UI mockups', dueDate: new Date().toISOString() },
        'task-3': { id: 'task-3', content: 'Implement core features', dueDate: new Date().toISOString() }
      };
      
      setBoardData({
        ...boardData,
        tasks: sampleTasks,
        columns: {
          ...boardData.columns,
          'todo': {
            ...boardData.columns.todo,
            taskIds: ['task-1', 'task-2']
          },
          'inProgress': {
            ...boardData.columns.inProgress,
            taskIds: ['task-3']
          }
        }
      });
    }
  }, [isLoaded]);

  // React-DnD handlers for columns and tasks
  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    // Drop outside the list or same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Handle column reordering
    if (type === 'column') {
      const newColumnOrder = reorder(
        boardData.columnOrder,
        source.index,
        destination.index
      );
      
      setBoardData({
        ...boardData,
        columnOrder: newColumnOrder
      });
      return;
    }

    // Handle task reordering
    const start = boardData.columns[source.droppableId];
    const finish = boardData.columns[destination.droppableId];

    // Moving within the same column
    if (start === finish) {
      const newTaskIds = reorder(
        start.taskIds,
        source.index,
        destination.index
      );

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newColumn.id]: newColumn
        }
      });
    } else {
      // Moving from one column to another
      const startTaskIds = Array.from(start.taskIds);
      startTaskIds.splice(source.index, 1);
      
      const newStart = {
        ...start,
        taskIds: startTaskIds
      };

      const finishTaskIds = Array.from(finish.taskIds);
      finishTaskIds.splice(destination.index, 0, draggableId);
      
      const newFinish = {
        ...finish,
        taskIds: finishTaskIds
      };

      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish
        }
      });
    }
  };

  // Initialize draggable JS for the board
  useEffect(() => {
    if (dragHandleRef.current) {
      // Make the board draggable using the native HTML5 Drag and Drop API
      const dragHandle = dragHandleRef.current;
      let offsetX, offsetY;
      let boardElement = document.getElementById('draggable-board');
      
      const onDragStart = (e) => {
        // Get the initial mouse position
        const rect = boardElement.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        
        e.dataTransfer.setData('text/plain', 'board'); // Required for Firefox
        e.dataTransfer.effectAllowed = 'move';
        
        // Use a transparent ghost image instead of default ghost
        const ghostImg = document.createElement('div');
        ghostImg.style.width = '1px';
        ghostImg.style.height = '1px';
        document.body.appendChild(ghostImg);
        e.dataTransfer.setDragImage(ghostImg, 0, 0);
        document.body.removeChild(ghostImg);
        
        // Add dragging class to the board
        boardElement.classList.add('dragging');
      };
      
      const onDrag = (e) => {
        if (e.clientX === 0 && e.clientY === 0) return; // Skip events with no coordinates
        
        // Calculate new position based on mouse position
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        
        setPosition({ x, y });
      };
      
      const onDragEnd = () => {
        boardElement.classList.remove('dragging');
      };
      
      // Add event listeners
      dragHandle.setAttribute('draggable', 'true');
      dragHandle.addEventListener('dragstart', onDragStart);
      dragHandle.addEventListener('drag', onDrag);
      dragHandle.addEventListener('dragend', onDragEnd);
      
      // Clean up
      return () => {
        if (dragHandle) {
          dragHandle.removeEventListener('dragstart', onDragStart);
          dragHandle.removeEventListener('drag', onDrag);
          dragHandle.removeEventListener('dragend', onDragEnd);
        }
      };
    }
  }, []);

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  const addTask = (columnId) => {
    const newTaskId = `task-${Date.now()}`;
    const newTask = {
      id: newTaskId,
      content: 'New task',
      dueDate: new Date().toISOString()
    };

    const column = boardData.columns[columnId];
    
    setBoardData({
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [newTaskId]: newTask
      },
      columns: {
        ...boardData.columns,
        [columnId]: {
          ...column,
          taskIds: [...column.taskIds, newTaskId]
        }
      }
    });
  };

  const addColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    
    setBoardData({
      ...boardData,
      columns: {
        ...boardData.columns,
        [newColumnId]: {
          id: newColumnId,
          title: 'New Column',
          taskIds: []
        }
      },
      columnOrder: [...boardData.columnOrder, newColumnId]
    });
  };

  const deleteColumn = (columnId, e) => {
    e.stopPropagation();
    
    // Get the tasks that need to be deleted
    const taskIdsToDelete = boardData.columns[columnId].taskIds;
    
    // Create a new tasks object without the deleted tasks
    const newTasks = { ...boardData.tasks };
    taskIdsToDelete.forEach(taskId => {
      delete newTasks[taskId];
    });
    
    // Create a new columns object without the deleted column
    const newColumns = { ...boardData.columns };
    delete newColumns[columnId];
    
    // Create a new column order without the deleted column
    const newColumnOrder = boardData.columnOrder.filter(id => id !== columnId);
    
    setBoardData({
      tasks: newTasks,
      columns: newColumns,
      columnOrder: newColumnOrder
    });
  };

  const startEditingColumn = (columnId, e) => {
    e.stopPropagation();
    setEditColumnId(columnId);
    setColumnTitle(boardData.columns[columnId].title);
  };

  const saveColumnTitle = () => {
    if (editColumnId) {
      setBoardData({
        ...boardData,
        columns: {
          ...boardData.columns,
          [editColumnId]: {
            ...boardData.columns[editColumnId],
            title: columnTitle.trim() || 'Untitled Column'
          }
        }
      });
      setEditColumnId(null);
    }
  };

  if (!isLoaded) return <div className="kanban-loading">Loading board...</div>;

  return (
    <div className="kanban-wrapper">
      <div 
        id="draggable-board"
        className="kanban-container" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px` 
        }}
      >
        <div 
          className="board-header" 
          ref={dragHandleRef}
        >
          <div className="drag-handle-icon">
            <span>☰</span> Drag Board
              </div>
          <div className="board-controls">
            <button 
              className="reset-button" 
              onClick={resetPosition}
            >
              Reset Position
            </button>
          </div>
        </div>
        
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable 
            droppableId="all-columns" 
            direction="horizontal" 
            type="column"
          >
            {(provided, snapshot) => (
              <div
                className={`columns-container ${snapshot.isDraggingOver ? 'columns-dragging-over' : ''}`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {boardData.columnOrder.map((columnId, index) => {
                  const column = boardData.columns[columnId];
                  const columnTasks = column.taskIds.map(taskId => boardData.tasks[taskId]);

                  return (
                    <Draggable 
                      key={column.id} 
                      draggableId={column.id} 
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`column-container ${snapshot.isDragging ? 'dragging-column' : ''}`}
                          {...provided.draggableProps}
                          ref={provided.innerRef}
                        >
                          <div className="kanban-section">
                            <div 
                              className="column-header" 
                              {...provided.dragHandleProps}
                            >
                              {editColumnId === column.id ? (
                                <div className="column-title-edit" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="text"
                                    value={columnTitle}
                                    onChange={(e) => setColumnTitle(e.target.value)}
                                    onBlur={saveColumnTitle}
                                    onKeyDown={(e) => e.key === 'Enter' && saveColumnTitle()}
                                    autoFocus
                                  />
                                </div>
                              ) : (
                                <h2 onClick={(e) => startEditingColumn(column.id, e)}>
                                  {column.title}
                                </h2>
                              )}
                              <div className="column-actions">
                                <button 
                                  className="delete-column-button" 
                                  onClick={(e) => deleteColumn(column.id, e)}
                                  title="Delete column"
                                >
                                  ×
          </button>
        </div>
                            </div>
                            
                            <Droppable droppableId={column.id} type="task">
                              {(provided, snapshot) => (
                                <div
                                  className={`tasks-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                                  ref={provided.innerRef}
                                  {...provided.droppableProps}
                                >
                                  {columnTasks.map((task, index) => (
                                    <Draggable 
                                      key={task.id} 
                                      draggableId={task.id} 
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                        >
                                          <div className="task-content">
                                            {task.content}
                                          </div>
                                          {task.dueDate && (
                                            <div className="task-duration">
                                              {new Date(task.dueDate).toLocaleDateString()}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                            
                            <button 
                              className="add-task-button" 
                              onClick={() => addTask(column.id)}
                            >
                              Add Task
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
                
                <div className="add-section" onClick={addColumn}>
                  Add Column
                </div>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard; 