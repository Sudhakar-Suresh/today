import React, { useState } from 'react';

const AddTask = () => {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle task addition logic here
    setTask('');
  };

  return (
    <div className="add-task">
      <form onSubmit={handleSubmit}>
        <button type="button" className="add-icon">+</button>
        <input
          type="text"
          placeholder="Add task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </form>
    </div>
  );
};

export default AddTask; 