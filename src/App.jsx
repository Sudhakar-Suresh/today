import React, { useState } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './components/MainContent/MainContent';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('My day');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="app">
      <Sidebar onPageChange={handlePageChange} />
      <MainContent currentPage={currentPage} />
    </div>
  );
}

export default App;
