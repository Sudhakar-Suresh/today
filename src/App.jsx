import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('My day');
  // Use a simple array of strings for lists
  const [userLists, setUserLists] = useState([
    'Personal', 'Work', 'Grocery List', 'New'
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddList = (newListName) => {
    console.log("App - Adding new list:", newListName);
    
    // Only add if it doesn't already exist
    if (!userLists.includes(newListName)) {
      const updatedLists = [...userLists, newListName];
      setUserLists(updatedLists);
      console.log("App - Updated lists:", updatedLists);
    }
    
    // Switch to the new list view
    setCurrentPage(newListName);
  };

  const handleUpdateTaskCount = (listName, change) => {
    setUserLists(userLists.map(list => 
      list.name === listName ? { ...list, count: Math.max(0, list.count + change) } : list
    ));
  };

  // Extract just the list names for components that need simple strings
  const listNames = userLists.map(list => list.name);

  return (
    <div className="app">
      <Sidebar 
        onPageChange={handlePageChange} 
        onAddList={handleAddList}
        userLists={userLists}
        activeItem={currentPage}
      />
      <MainContent 
        currentPage={currentPage} 
        userLists={userLists}
        onUpdateTaskCount={handleUpdateTaskCount}
      />
    </div>
  );
}

export default App;
