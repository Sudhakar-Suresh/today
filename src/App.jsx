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

  return (
    <div className="app-container">
      <Sidebar 
        onPageChange={handlePageChange} 
        activeItem={currentPage}
        userLists={userLists}
        onAddList={handleAddList}
        onListSelect={handleListSelect}
        onSidebarToggle={handleSidebarToggle}
      />
      <MainContent 
        currentPage={currentPage} 
        userLists={userLists}
        selectedList={selectedList}
        isSidebarExpanded={isSidebarExpanded}
      />
    </div>
  );
}

export default App;
