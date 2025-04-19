import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('My day');
  const [userLists, setUserLists] = useState([
    'Personal', 'Work', 'Shopping', 'Ideas'
  ]);
  const [selectedList, setSelectedList] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  
  // Sample tasks with due dates
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project documentation",
      completed: false,
      list: "Work",
      dueDate: new Date().toISOString() // Today
    },
    {
      id: 2,
      title: "Review weekly goals",
      completed: false,
      list: "Personal",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
    },
    {
      id: 3,
      title: "Buy groceries",
      completed: true,
      list: "Shopping",
      dueDate: new Date().toISOString()
    }
  ]);

  // Helper functions for date checking
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

  // Calculate task counts for badges
  const taskCounts = {
    myDay: tasks.filter(task => !task.completed && isTaskDueToday(task)).length,
    next7Days: tasks.filter(task => !task.completed && isTaskDueInNext7Days(task)).length,
    allTasks: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedList(null);
  };

  const handleListSelect = (listName) => {
    setSelectedList(listName);
  };

  const handleAddList = (newList) => {
    if (!userLists.includes(newList)) {
      setUserLists([...userLists, newList]);
    }
  };

  const handleSidebarToggle = (expanded) => {
    setIsSidebarExpanded(expanded);
  };

  const handleTaskUpdate = (updatedTasks) => {
    setTasks(updatedTasks);
  };

  return (
    <div className="app-container">
      <Sidebar 
        onPageChange={handlePageChange} 
        activeItem={currentPage}
        userLists={userLists}
        onAddList={handleAddList}
        onListSelect={handleListSelect}
        onSidebarToggle={handleSidebarToggle}
        taskCounts={taskCounts}
      />
      <MainContent 
        currentPage={currentPage} 
        userLists={userLists}
        selectedList={selectedList}
        isSidebarExpanded={isSidebarExpanded}
        tasks={tasks}
        onTaskUpdate={handleTaskUpdate}
      />
    </div>
  );
}

export default App;
