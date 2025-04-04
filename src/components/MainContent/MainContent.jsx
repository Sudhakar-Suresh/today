import React, { useState, useEffect } from 'react';
import MyDay from '../pages/MyDay';
import AllTasks from '../pages/AllTasks';
import Next7Days from '../pages/Next7Days';
import Calendar from '../pages/Calendar';
import CompletedTasks from '../pages/CompletedTasks';
import './MainContent.css';

const MainContent = ({ currentPage, userLists = [], selectedList = null, isSidebarExpanded = false }) => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Sample Task",
      completed: false,
      list: "Personal"
    },
    {
      id: 2,
      title: "Work Project",
      completed: false,
      list: "Work"
    },
    {
      id: 3,
      title: "Buy groceries",
      completed: false,
      list: "Shopping"
    }
  ]);
  
  // For filtered tasks based on selected list
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Apply list filtering 
  useEffect(() => {
    if (selectedList) {
      // When a list is selected, filter tasks by that list
      setFilteredTasks(tasks.filter(task => task.list === selectedList));
    } else {
      // Otherwise use all tasks
      setFilteredTasks(tasks);
    }
  }, [selectedList, tasks]);
  
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
  
  // Render the appropriate component based on currentPage
  return (
    <div className={`main-content ${isSidebarExpanded ? 'with-sidebar' : 'full-width'}`}>
      {currentPage === 'My day' && (
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
      )}
      
      {currentPage === 'Next 7 days' && (
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
      )}
      
      {currentPage === 'All my tasks' && (
        <AllTasks 
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
      )}
      
      {currentPage === 'My Calendar' && (
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
      )}
      
      {currentPage === 'Completed tasks' && (
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
      )}
    </div>
  );
};

export default MainContent;
