import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import MemoryGrid from './components/MemoryGrid';
import ConnectionsGrid from './components/ConnectionsGrid';
import ChatHistory from './components/ChatHistory';
import ChatHistoryList from './components/ChatHistoryList';
import ProfilePage from './components/ProfilePage';

function App() {
  const [activePage, setActivePage] = useState('memory');
  const [selectedChatDay, setSelectedChatDay] = useState(null);

  const handleSelectChatDay = (dayId) => {
    setSelectedChatDay(dayId);
  };

  const handleBackFromChat = () => {
    setSelectedChatDay(null);
  };

  const renderActivePage = () => {
    switch (activePage) {
      case 'connections':
        return <ConnectionsGrid />;
      case 'history':
        return selectedChatDay ? 
          <ChatHistory dayId={selectedChatDay} onBack={handleBackFromChat} /> : 
          <ChatHistoryList onSelectDay={handleSelectChatDay} />;
      case 'profile':
        return <ProfilePage />;
      case 'memory':
      default:
        return <MemoryGrid />;
    }
  };

  return (
    <div className="App">
      {!(activePage === 'history' && selectedChatDay) && (
        <Navbar activePage={activePage} onPageChange={setActivePage} />
      )}
      {renderActivePage()}
    </div>
  );
}

export default App;
