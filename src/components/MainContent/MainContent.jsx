import React, { useState } from "react";
import TaskCard from "../TaskCard/TaskCard";
import "./MainContent.css";

const MainContent = () => {
  const [tasks, setTasks] = useState([]); // Initialize tasks state
  const [newTask, setNewTask] = useState("");

  const addTask = (event) => {
    event.preventDefault();
    if (newTask.trim() === "") return;

    const newTaskObj = {
      id: Date.now(),
      title: newTask,
    };

    setTasks([...tasks, newTaskObj]); // Update tasks list safely
    setNewTask(""); // Clear input after adding
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="main-content">
      <h2>Good Afternoon, Sudhakar</h2>
      <p>Run your day or your day will run you</p>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>You have no events scheduled for today</p>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onDelete={deleteTask} />)
        )}
      </div>

      <form onSubmit={addTask} className="task-input">
        <input
          type="text"
          placeholder="Enter task title"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">➤</button>
      </form>
    </div>
  );
};

export default MainContent;
