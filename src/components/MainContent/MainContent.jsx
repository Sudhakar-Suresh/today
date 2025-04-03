import React, { useState } from 'react';
import MyDay from '../pages/MyDay';
import AllTasks from '../pages/AllTasks';
import Next7Days from '../pages/Next7Days';
import Calendar from '../pages/Calendar';
import CompletedTasks from '../pages/CompletedTasks';
import './MainContent.css';

const MainContent = ({ currentPage, userLists = ['Personal', 'Work', 'Shopping', 'Ideas'] }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Sample Task",
      completed: false,
      list: "Personal"
    }
  ]);
  
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
  
  const activeTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  // Render different page content based on currentPage
  const renderPage = () => {
    if (userLists.includes(currentPage)) {
      // This is a user list view
      const listTasks = tasks.filter(task => task.list === currentPage && !task.completed);
      return (
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
                  />
                ))}
              </div>
            ) : (
              <p>No tasks in your {currentPage} list</p>
            )}
          </div>
        </div>
      );
    }
    
    // For standard views (My day, Completed tasks, etc.)
    switch(currentPage) {
      case 'My day':
        return (
          <MyDay 
            tasks={activeTasks} 
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
          />
        );
      case 'Next 7 days':
        return (
          <Next7Days 
            tasks={activeTasks} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
          />
        );
      case 'All my tasks':
        return (
          <AllTasks 
            tasks={activeTasks} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
          />
        );
      case 'My Calendar':
        return (
          <Calendar 
            tasks={activeTasks} 
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
          />
        );
      case 'Completed tasks':
        return (
          <CompletedTasks 
            tasks={completedTasks} 
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
          />
        );
      default:
        return (
          <MyDay 
            tasks={activeTasks} 
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
          />
        );
    }
  };

  return (
    <div className="main-content">
      {renderPage()}
    </div>
  );
};

export default MainContent;
