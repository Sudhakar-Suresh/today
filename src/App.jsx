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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Reset selected list when changing pages
    setSelectedList(null);
  };

  const handleListSelect = (listName) => {
    console.log(`List selected: ${listName}`);
    setSelectedList(listName);
    // Don't change the current page
  };

  const handleAddList = (newList) => {
    if (!userLists.includes(newList)) {
      setUserLists([...userLists, newList]);
    }
  };

  return (
    <div className={`app-container ${isSidebarOpen ? 'with-sidebar' : 'sidebar-closed'}`}>
      <Sidebar 
        onPageChange={handlePageChange} 
        activeItem={currentPage}
        userLists={userLists}
        onAddList={handleAddList}
        onListSelect={handleListSelect}
      />
      <MainContent 
        currentPage={currentPage} 
        userLists={userLists}
        selectedList={selectedList}
      />
    </div>
  );
}

export default App;
