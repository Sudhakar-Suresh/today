import React, { useState, useEffect } from 'react';
import MyDay from '../pages/MyDay';
import Next7Days from '../pages/Next7Days';
import Calendar from '../pages/Calendar';
import CompletedTasks from '../pages/CompletedTasks';
import AllTasksPage from '../pages/AllTasksPage';
import './MainContent.css';

const MainContent = ({ 
  currentPage, 
  userLists = [], 
  selectedList = null, 
  isSidebarExpanded = false,
  tasks = [],
  onTaskUpdate
}) => {
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (selectedList) {
      setFilteredTasks(tasks.filter(task => task.list === selectedList));
    } else {
      setFilteredTasks(tasks);
    }
  }, [selectedList, tasks]);

  const handleAddTask = (newTask) => {
    onTaskUpdate([...tasks, newTask]);
  };

  const handleToggleComplete = (taskId, isCompleted) => {
    onTaskUpdate(tasks.map(task =>
      task.id === taskId ? { ...task, completed: isCompleted } : task
    ));
  };

  const handleDelete = (taskId) => {
    onTaskUpdate(tasks.filter(task => task.id !== taskId));
  };
  
  const handleUpdateTags = (taskId, newTags) => {
    onTaskUpdate(tasks.map(task =>
      task.id === taskId ? { ...task, tags: newTags } : task
    ));
  };
  
  const handleUpdateList = (taskId, newList) => {
    console.log("MainContent - Updating task", taskId, "to list:", newList);
    onTaskUpdate(tasks.map(task =>
      task.id === taskId ? { ...task, list: newList } : task
    ));
  };
  
  const handleTogglePin = (taskId, isPinned) => {
    onTaskUpdate(tasks.map(task =>
      task.id === taskId ? { ...task, pinned: isPinned } : task
    ));
  };
  
  const handleUpdateReminder = (taskId, reminderData) => {
    onTaskUpdate(tasks.map(task =>
      task.id === taskId ? { ...task, reminder: reminderData } : task
    ));
  };
  
  // Prepare task data for different views
  const activeTasks = selectedList 
    ? filteredTasks.filter(task => !task.completed) 
    : tasks.filter(task => !task.completed);
    
  const completedTasks = selectedList 
    ? filteredTasks.filter(task => task.completed) 
    : tasks.filter(task => task.completed);
  
  // Title modifier for when a list is selected
  const getPageTitle = () => {
    if (selectedList) {
      return `${currentPage} - ${selectedList}`;
    }
    return currentPage;
  };
  
  const renderContent = () => {
    switch (currentPage) {
      case 'All My Tasks':
      case 'All my tasks':
        return <AllTasksPage />;
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
            availableLists={userLists}
            listFilter={selectedList}
            isSidebarExpanded={isSidebarExpanded}
          />
        );
      case 'Next 7 days':
        return (
          <Next7Days 
            tasks={activeTasks}
            onAddTask={handleAddTask}
            onToggleComplete={handleToggleComplete} 
            onDelete={handleDelete} 
            onUpdateTags={handleUpdateTags} 
            onUpdateList={handleUpdateList}
            onTogglePin={handleTogglePin}
            onUpdateReminder={handleUpdateReminder}
            availableLists={userLists}
            isSidebarExpanded={isSidebarExpanded}
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
            availableLists={userLists}
            listFilter={selectedList}
            pageTitle={getPageTitle()}
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
            availableLists={userLists}
            listFilter={selectedList}
            pageTitle={getPageTitle()}
          />
        );
      default:
        return <div>Select a page from the menu</div>;
    }
  };

  return (
    <div className={`main-content ${isSidebarExpanded ? 'with-sidebar' : 'full-width'}`}>
      {renderContent()}
    </div>
  );
};

export default MainContent;
