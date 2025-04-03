import React, { useState } from 'react';
import MyDay from '../pages/MyDay';
import AllTasks from '../pages/AllTasks';
import Next7Days from '../pages/Next7Days';
import Calendar from '../pages/Calendar';
import CompletedTasks from '../pages/CompletedTasks';
import './MainContent.css';

const MainContent = ({ currentPage }) => {
  const [tasks, setTasks] = useState([]);
  
  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };
  
  const handleToggleComplete = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
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

  // Render different page content based on currentPage
  const renderPage = () => {
    switch(currentPage) {
      case 'My day':
        return <MyDay />;
      case 'Next 7 days':
        return <Next7Days tasks={tasks} onToggleComplete={handleToggleComplete} onDelete={handleDelete} onUpdateTags={handleUpdateTags} onUpdateList={handleUpdateList} />;
      case 'All my tasks':
        return <AllTasks tasks={tasks} onToggleComplete={handleToggleComplete} onDelete={handleDelete} onUpdateTags={handleUpdateTags} onUpdateList={handleUpdateList} />;
      case 'My Calendar':
        return <Calendar tasks={tasks} onToggleComplete={handleToggleComplete} onDelete={handleDelete} onUpdateTags={handleUpdateTags} onUpdateList={handleUpdateList} />;
      case 'Completed tasks':
        return <CompletedTasks tasks={tasks.filter(task => task.completed)} onDelete={handleDelete} onUpdateTags={handleUpdateTags} onUpdateList={handleUpdateList} />;
      default:
        return <MyDay />;
    }
  };

  return (
    <div className="main-content">
      {renderPage()}
    </div>
  );
};

export default MainContent;
