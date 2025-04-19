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
  
  // Helper functions for date checking (copied from App.jsx)
  const isTaskDueToday = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return today.toDateString() === dueDate.toDateString();
  };

  const isTaskDueInNext7Days = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= next7Days;
  };
  
  // Prepare task data for different views
  const activeTasks = selectedList 
    ? filteredTasks.filter(task => !task.completed) 
    : tasks.filter(task => !task.completed);
    
  const completedTasks = selectedList 
    ? filteredTasks.filter(task => task.completed) 
    : tasks.filter(task => task.completed);
  
  // Filter tasks for My Day view
  const myDayTasks = activeTasks.filter(task => isTaskDueToday(task));
  
  // Filter tasks for Next 7 Days view
  const next7DaysTasks = activeTasks.filter(task => isTaskDueInNext7Days(task));
  
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
        return <AllTasksPage 
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
        />;
      case 'My day':
        return (
          <MyDay 
            tasks={myDayTasks} // Only pass tasks due today
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
            tasks={next7DaysTasks} // Only pass tasks due in next 7 days
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
