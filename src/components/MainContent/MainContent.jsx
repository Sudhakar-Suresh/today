import React, { useState, useEffect } from 'react';
import MyDay from '../pages/MyDay';
import AllTasks from '../pages/AllTasks';
import Next7Days from '../pages/Next7Days';
import Calendar from '../pages/Calendar';
import CompletedTasks from '../pages/CompletedTasks';
import TaskCard from '../TaskCard/TaskCard';
import './MainContent.css';

const MainContent = ({ currentPage, userLists = [], onUpdateTaskCount }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Sample Task",
      completed: false,
      list: "Personal"
    }
  ]);
  
  // Update task count when tasks change
  useEffect(() => {
    if (onUpdateTaskCount) {
      const listCounts = {};
      
      // Count active tasks per list
      tasks.filter(task => !task.completed).forEach(task => {
        if (task.list) {
          listCounts[task.list] = (listCounts[task.list] || 0) + 1;
        }
      });
      
      // Update counts through parent callback
      userLists.forEach(listName => {
        const currentCount = listCounts[listName] || 0;
        onUpdateTaskCount(listName, currentCount);
      });
    }
  }, [tasks, userLists, onUpdateTaskCount]);
  
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  
  const handleToggleComplete = (taskId, isCompleted) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: isCompleted } : task
    ));
  };
  
  const handleDelete = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  
  const handleUpdateTags = (taskId, newTags) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, tags: newTags } : task
    ));
  };
  
  const handleUpdateList = (taskId, newList) => {
    console.log("MainContent - Updating task", taskId, "to list:", newList);
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, list: newList } : task
    ));
  };
  
  const handleTogglePin = (taskId, isPinned) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, pinned: isPinned } : task
    ));
  };
  
  const handleUpdateReminder = (taskId, reminderData) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, reminder: reminderData } : task
    ));
  };
  
  // Check if current page is a custom list
  const isCustomList = userLists.includes(currentPage);
  
  // For standard views
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  // If current page is a custom list, render list-specific view
  if (isCustomList) {
    const listTasks = tasks.filter(task => task.list === currentPage && !task.completed);
    
    return (
      <div className="main-content">
        <div className="page-content">
          <header className="header-section">
            <div className="greeting-container">
              <h1>{currentPage}</h1>
              <p className="subtitle">Tasks in your {currentPage} list</p>
            </div>
          </header>
          
          <div className="list-tasks-content">
            {listTasks.length > 0 ? (
              <div className="tasks-area">
                {listTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                    onUpdateTags={handleUpdateTags}
                    onUpdateList={handleUpdateList}
                    onTogglePin={handleTogglePin}
                    onUpdateReminder={handleUpdateReminder}
                    availableLists={userLists}
                  />
                ))}
              </div>
            ) : (
              <p>No tasks in your {currentPage} list</p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Otherwise render standard pages
  let content;
  switch(currentPage) {
    case 'My day':
      content = (
        <MyDay 
          tasks={activeTasks} 
          onAddTask={handleAddTask}
          onToggleComplete={handleToggleComplete} 
          onDelete={handleDelete} 
          onUpdateTags={handleUpdateTags} 
          onUpdateList={handleUpdateList}
          onTogglePin={handleTogglePin}
          onUpdateReminder={handleUpdateReminder}
          availableLists={userLists}
        />
      );
      break;
    case 'Next 7 days':
      content = (
        <Next7Days 
          tasks={activeTasks} 
          onToggleComplete={handleToggleComplete} 
          onDelete={handleDelete} 
          onUpdateTags={handleUpdateTags} 
          onUpdateList={handleUpdateList}
          onTogglePin={handleTogglePin}
          onUpdateReminder={handleUpdateReminder}
          availableLists={userLists}
        />
      );
      break;
    case 'All my tasks':
      content = (
        <AllTasks 
          tasks={activeTasks} 
          onToggleComplete={handleToggleComplete} 
          onDelete={handleDelete} 
          onUpdateTags={handleUpdateTags} 
          onUpdateList={handleUpdateList}
          onTogglePin={handleTogglePin}
          onUpdateReminder={handleUpdateReminder}
          availableLists={userLists}
        />
      );
      break;
    case 'My Calendar':
      content = (
        <Calendar 
          tasks={activeTasks} 
          onToggleComplete={handleToggleComplete} 
          onDelete={handleDelete} 
          onUpdateTags={handleUpdateTags} 
          onUpdateList={handleUpdateList}
          onTogglePin={handleTogglePin}
          onUpdateReminder={handleUpdateReminder}
          availableLists={userLists}
        />
      );
      break;
    case 'Completed tasks':
      content = (
        <CompletedTasks 
          tasks={completedTasks} 
          onToggleComplete={handleToggleComplete}
          onDelete={handleDelete} 
          onUpdateTags={handleUpdateTags} 
          onUpdateList={handleUpdateList}
          onTogglePin={handleTogglePin}
          onUpdateReminder={handleUpdateReminder}
          availableLists={userLists}
        />
      );
      break;
    default:
      content = (
        <MyDay 
          tasks={activeTasks} 
          onAddTask={handleAddTask}
          onToggleComplete={handleToggleComplete} 
          onDelete={handleDelete} 
          onUpdateTags={handleUpdateTags} 
          onUpdateList={handleUpdateList}
          onTogglePin={handleTogglePin}
          onUpdateReminder={handleUpdateReminder}
          availableLists={userLists}
        />
      );
  }

  return (
    <div className="main-content">
      {content}
    </div>
  );
};

export default MainContent;
