import React, { useState } from 'react';
import aiIcon from '../assets/icons/AI.jpg';
import humanIcon from '../assets/icons/Human.png';

const ChatHistoryList = ({ onSelectDay }) => {
  // Sample chat history data
  const [chatDays, setChatDays] = useState([
    {
      id: 1,
      date: '18-April-2025',
      preview: 'I\'m trying to remember my grandmother\'s birthday.'
    },
    {
      id: 2,
      date: '17-April-2025',
      preview: 'Can you remind me where I put my passport?'
    },
    {
      id: 3,
      date: '15-April-2025',
      preview: 'How do I add a new family member?'
    },
    {
      id: 4,
      date: '10-April-2025',
      preview: 'Yes, how do I do that?'
    },
    {
      id: 5,
      date: '05-April-2025',
      preview: 'Yes, what options do I have?'
    }
  ]);

  // Styles
  const pageStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const headerTitleStyle = {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  };

  const chatListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const dayItemStyle = {
    backgroundColor: 'white',
    padding: '1.25rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem'
  };

  const avatarStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    overflow: 'hidden'
  };

  const dateStyle = {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#333'
  };

  const previewStyle = {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.25rem'
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={headerTitleStyle}>Chat History</h2>
      </div>

      <div style={chatListStyle}>
        {chatDays.map(day => (
          <div
            key={day.id}
            style={dayItemStyle}
            onClick={() => onSelectDay(day.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={avatarStyle}>
              <img
                src={day.id % 2 === 0 ? aiIcon : humanIcon}
                alt="avatar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div>
              <div style={dateStyle}>{day.date}</div>
              <div style={previewStyle}>{day.preview}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistoryList; 