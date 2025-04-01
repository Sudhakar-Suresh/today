import React, { useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import AddTask from "../AddTask/AddTask";
import "./MainContent.css";

const MainContent = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Connect your calendar",
      list: "Personal",
      isDefault: true
    },
    {
      id: 2,
      title: "Watch My day tutorial",
      list: "Personal",
      isDefault: true
    },
    {
      id: 3,
      title: "Create your first task ↓",
      list: "Personal",
      isDefault: true
    }
  ]);

  const handleAddTask = (newTask) => {
    const updatedTasks = tasks.filter(task => !task.isDefault);
    setTasks([...updatedTasks, newTask]);
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

  return (
    <div className="main-content">
      <div className="content-wrapper">
        <div className="header-section">
          <div className="greeting-container">
            <h1>Good Night, Sudhakar<span className="dot">.</span></h1>
            <p className="subtitle">Be so good no one can ignore you</p>
          </div>
          
          <div className="header-actions">
            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
              </svg>
            </button>
            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
            </button>
            <button className="header-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="date-section">
          <div className="date-info">
            <div className="date-label">TUE</div>
            <div className="date-number">1</div>
            <div className="date-month">April</div>
          </div>
          <div className="calendar-connect">
            <p>Join video meetings with one tap</p>
            <div className="calendar-buttons">
              <button className="calendar-btn google">
                <img src="/google-calendar.png" alt="" />
                Connect Google Calendar
              </button>
              <button className="calendar-btn outlook">
                <img src="/outlook.png" alt="" />
                Connect Outlook Calendar
              </button>
            </div>
          </div>
        </div>

        <div className="tasks-section">
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onDelete={handleDeleteTask}
                onUpdateTags={handleUpdateTags}
                onUpdateList={handleUpdateList}
              />
            ))}
          </div>
        </div>
      </div>

      <AddTask onAddTask={handleAddTask} />
    </div>
  );
};

export default MainContent;
