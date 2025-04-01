import React, { useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import AddTask from "../AddTask/AddTask";
import "./MainContent.css";
import MyDay from '../pages/MyDay';
import Next7Days from '../pages/Next7Days';
import AllTasks from '../pages/AllTasks';
import Calendar from '../pages/Calendar';
import CompletedTasks from '../pages/CompletedTasks';
import Sidebar from '../Sidebar/Sidebar';

const MainContent = () => {
  const [activeView, setActiveView] = useState('my-day');
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Create your first task",
      list: "Personal",
      completed: false
    }
  ]);

  const handleToggleComplete = (taskId, completed) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleUpdateTags = (taskId, updatedTags) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, tags: updatedTags } : task
    ));
  };

  const handleUpdateList = (taskId, newList) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, list: newList } : task
    ));
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, {
      ...newTask,
      id: Date.now(),
      completed: false,
      date: new Date()
    }]);
  };

  const renderActivePage = () => {
    const props = {
      tasks,
      onToggleComplete: handleToggleComplete,
      onDelete: handleDeleteTask,
      onUpdateTags: handleUpdateTags,
      onUpdateList: handleUpdateList
    };

    switch (activeView) {
      case 'my-day':
        return (
          <>
            <MyDay {...props} />
            <AddTask onAddTask={handleAddTask} />
          </>
        );
      case 'next-7-days':
        return <Next7Days {...props} />;
      case 'all-tasks':
        return <AllTasks {...props} />;
      case 'calendar':
        return <Calendar {...props} />;
      case 'completed':
        return <CompletedTasks {...props} />;
      default:
        return (
          <>
            <MyDay {...props} />
            <AddTask onAddTask={handleAddTask} />
          </>
        );
    }
  };

  return (
    <div className="app-layout">
      <Sidebar activeView={activeView} onViewChange={setActiveView} />
      <div className="main-content">
        {renderActivePage()}
      </div>
    </div>
  );
};

export default MainContent;
