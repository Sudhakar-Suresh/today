import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('My day');
  const [lists, setLists] = useState(['Personal', 'Work', 'Shopping', 'Ideas']);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAddList = (newListName) => {
    if (!lists.includes(newListName)) {
      setLists([...lists, newListName]);
    }
    // Optionally switch to the new list view
    setCurrentPage(newListName);
  };

  return (
    <div className="app">
      <Sidebar onPageChange={handlePageChange} onAddList={handleAddList} />
      <MainContent currentPage={currentPage} userLists={lists} />
    </div>
  );
}

export default App;
