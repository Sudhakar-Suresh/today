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
  
  // Define tasks at the App level
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project documentation",
      completed: false,
      list: "Work",
      dueDate: new Date().toISOString()
    },
    {
      id: 2,
      title: "Review weekly goals",
      completed: false,
      list: "Personal",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      title: "Buy groceries",
      completed: true,
      list: "Shopping",
      dueDate: new Date().toISOString()
    },
    {
      id: 4,
      title: "Team meeting preparation",
      completed: false,
      list: "Work",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);

  // Helper functions for date checking
  const isTaskDueToday = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return today.getTime() === dueDate.getTime();
  };

  const isTaskDueInNext7Days = (task) => {
    if (!task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 7);
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= today && dueDate <= next7Days;
  };

  // Calculate task counts
  const taskCounts = {
    myDay: tasks.filter(task => 
      !task.completed && (
        task.sourceView === 'myday' || 
        (isTaskDueToday(task) && task.sourceView !== 'next7days')
      )
    ).length,
    next7Days: tasks.filter(task => 
      !task.completed && (
        isTaskDueInNext7Days(task) || 
        task.sourceView === 'next7days'
      )
    ).length,
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

  const handleAddTask = async (newTask) => {
    try {
      // Ensure task has all required properties
      const completeTask = {
        ...newTask,
        id: newTask.id || Date.now(),
        completed: newTask.completed || false,
        list: newTask.list || "Personal",
        dueDate: newTask.dueDate || new Date().toISOString(),
        sourceView: newTask.sourceView || currentPage.toLowerCase().replace(/\s+/g, ''),
        tags: newTask.tags || []
      };
      
      // Add the new task to the tasks array
      setTasks(prevTasks => [...prevTasks, completeTask]);
      
      return true; // Indicate successful save
    } catch (error) {
      console.error('Error adding task:', error);
      return false; // Indicate failed save
    }
  };

  const handleAddToMyDay = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          isInMyDay: !task.isInMyDay,
          sourceView: !task.isInMyDay ? 'myday' : task.sourceView
        };
      }
      return task;
    }));
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
        onAddTask={handleAddTask}
        onAddToMyDay={handleAddToMyDay}
      />
    </div>
  );
}

export default App;
