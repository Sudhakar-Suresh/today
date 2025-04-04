import React, { useState } from 'react';
import TaskCard from '../TaskCard/TaskCard';
import './TodoList.css';

const TodoList = () => {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Complete project documentation",
      list: "Work",
      tags: [
        { name: "Priority", color: "#FFD84D" },
        { name: "Work", color: "#57CC57" }
      ],
      notes: "Need to add diagrams and update API references",
      subtasks: [
        { text: "Update class diagrams", completed: true },
        { text: "Add API endpoint details", completed: false }
      ],
      completed: false,
      pinned: true
    },
    {
      id: 2,
      title: "Buy groceries",
      list: "Shopping",
      tags: [
        { name: "Personal", color: "#4D8BF0" }
      ],
      notes: "Milk, eggs, bread, vegetables",
      subtasks: [],
      completed: false,
      pinned: false
    }
  ]);

  // Delete a task
  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Toggle task completion
  const handleToggleTaskComplete = (taskId, completed) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed } : task
    ));
  };

  // Update task title
  const handleUpdateTaskTitle = (taskId, newTitle) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle } : task
    ));
  };

  // Update task notes
  const handleUpdateTaskNotes = (taskId, newNotes) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, notes: newNotes } : task
    ));
  };

  // Update task list
  const handleUpdateTaskList = (taskId, newList) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, list: newList } : task
    ));
  };

  // Update task tags
  const handleUpdateTaskTags = (taskId, newTags) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, tags: newTags } : task
    ));
  };

  // Toggle task pin status
  const handleToggleTaskPin = (taskId, pinned) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, pinned } : task
    ));
  };

  // Update task reminder
  const handleUpdateTaskReminder = (taskId, reminder) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, reminder } : task
    ));
  };

  // Update task subtasks
  const handleUpdateTaskSubtasks = (taskId, subtasks) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, subtasks } : task
    ));
  };

  // Add task attachment
  const handleAddTaskAttachment = (taskId, attachment) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const attachments = task.attachments ? [...task.attachments, attachment] : [attachment];
        return { ...task, attachments };
      }
      return task;
    }));
  };

  const availableLists = ["Personal", "Work", "Shopping", "Ideas", "Finances"];

  return (
    <div className="todo-list-container">
      <h2>My Tasks</h2>
      <div className="tasks-container">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={handleDeleteTask}
            onToggleComplete={handleToggleTaskComplete}
            onUpdateTitle={handleUpdateTaskTitle}
            onUpdateNotes={handleUpdateTaskNotes}
            onUpdateList={handleUpdateTaskList}
            onUpdateTags={handleUpdateTaskTags}
            onTogglePin={handleToggleTaskPin}
            onUpdateReminder={handleUpdateTaskReminder}
            onUpdateSubtasks={handleUpdateTaskSubtasks}
            onAddAttachment={handleAddTaskAttachment}
            availableLists={availableLists}
          />
        ))}
      </div>
    </div>
  );
};

export default TodoList; 