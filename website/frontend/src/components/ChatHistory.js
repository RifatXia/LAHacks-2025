import React from 'react';
import aiIcon from '../assets/icons/AI.jpg';
import humanIcon from '../assets/icons/Human.png';

const ChatHistory = ({ dayId, onBack }) => {
  // Sample chat history data for specific days
  const chatDays = {
    1: {
      date: '18-April-2025',
      conversations: [
        { id: 1, sender: 'AI', message: 'Hello! How can I help you today?', time: '10:32 AM' },
        { id: 2, sender: 'Human', message: 'I\'m trying to remember my grandmother\'s birthday.', time: '10:33 AM' },
        { id: 3, sender: 'AI', message: 'Let me check your family connections. Your grandmother, Martha Smith, was born on June 15, 1945.', time: '10:33 AM' },
        { id: 4, sender: 'Human', message: 'Thank you! That\'s right.', time: '10:34 AM' },
      ]
    },
    2: {
      date: '17-April-2025',
      conversations: [
        { id: 5, sender: 'AI', message: 'Good morning! What would you like to remember today?', time: '09:15 AM' },
        { id: 6, sender: 'Human', message: 'Can you remind me where I put my passport?', time: '09:16 AM' },
        { id: 7, sender: 'AI', message: 'According to your last note, you stored your passport in the top drawer of your desk.', time: '09:16 AM' },
      ]
    },
    3: {
      date: '15-April-2025',
      conversations: [
        { id: 8, sender: 'AI', message: 'Welcome to Mnemosyne! I\'m here to help you remember important details.', time: '14:22 PM' },
        { id: 9, sender: 'Human', message: 'How do I add a new family member?', time: '14:23 PM' },
        { id: 10, sender: 'AI', message: 'You can go to the Connections tab and click the "+" button to add a new person. You\'ll need to upload 5 photos of them.', time: '14:23 PM' },
        { id: 11, sender: 'Human', message: 'Got it, thanks!', time: '14:24 PM' },
      ]
    },
    4: {
      date: '10-April-2025',
      conversations: [
        { id: 12, sender: 'AI', message: 'Hello! Would you like to create your first memory?', time: '11:05 AM' },
        { id: 13, sender: 'Human', message: 'Yes, how do I do that?', time: '11:06 AM' },
        { id: 14, sender: 'AI', message: 'Go to the Memory tab and click the "+" button. You can upload photos, videos, or audio files.', time: '11:06 AM' },
        { id: 15, sender: 'Human', message: 'Great, I\'ll try that now!', time: '11:07 AM' },
      ]
    },
    5: {
      date: '05-April-2025',
      conversations: [
        { id: 16, sender: 'AI', message: 'Welcome to Mnemosyne! Would you like to set up your account preferences?', time: '15:30 PM' },
        { id: 17, sender: 'Human', message: 'Yes, what options do I have?', time: '15:31 PM' },
        { id: 18, sender: 'AI', message: 'You can enable notifications, dark mode, and automatic backups. Would you like me to walk you through these settings?', time: '15:31 PM' },
        { id: 19, sender: 'Human', message: 'Yes please, show me where to find those.', time: '15:32 PM' },
        { id: 20, sender: 'AI', message: 'Go to your Profile page and scroll down to the Preferences section. There you can toggle each setting on or off.', time: '15:32 PM' },
      ]
    }
  };

  const selectedDay = chatDays[dayId];

  // Styles
  const pageStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem'
  };

  const backButtonStyle = {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    marginRight: '1rem',
    padding: '0.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  };

  const headerTitleStyle = {
    fontSize: '1.5rem',
    margin: 0,
    flex: 1
  };

  const dateStyle = {
    color: '#666',
    fontSize: '0.9rem'
  };

  const chatContainerStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  const messageContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  };

  const messageStyle = (sender) => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: sender === 'AI' ? 'flex-start' : 'flex-end',
    gap: '0.75rem'
  });

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    overflow: 'hidden'
  };

  const bubbleStyle = (sender) => ({
    maxWidth: '70%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    backgroundColor: sender === 'AI' ? '#f0f0f0' : '#4a90e2',
    color: sender === 'AI' ? '#333' : 'white'
  });

  const timeStyle = {
    fontSize: '0.75rem',
    color: '#999',
    marginTop: '0.25rem'
  };

  const getAvatarImage = (sender) => {
    return sender === 'AI' ? aiIcon : humanIcon;
  };

  if (!selectedDay) {
    return (
      <div style={pageStyle}>
        <div style={headerStyle}>
          <button style={backButtonStyle} onClick={onBack}>
            ←
          </button>
          <h2 style={headerTitleStyle}>Chat not found</h2>
        </div>
        <p>Sorry, this chat history could not be found.</p>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <button 
          style={backButtonStyle} 
          onClick={onBack}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0f0f0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          ←
        </button>
        <div>
          <h2 style={headerTitleStyle}>Chat History</h2>
          <div style={dateStyle}>{selectedDay.date}</div>
        </div>
      </div>
      
      <div style={chatContainerStyle}>
        <div style={messageContainerStyle}>
          {selectedDay.conversations.map(message => (
            <div key={message.id} style={messageStyle(message.sender)}>
              {message.sender === 'AI' && (
                <div style={avatarStyle}>
                  <img 
                    src={getAvatarImage(message.sender)} 
                    alt={message.sender}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
              <div>
                <div style={bubbleStyle(message.sender)}>
                  {message.message}
                </div>
                <div style={{ ...timeStyle, textAlign: message.sender === 'AI' ? 'left' : 'right' }}>
                  {message.time}
                </div>
              </div>
              {message.sender === 'Human' && (
                <div style={avatarStyle}>
                  <img 
                    src={getAvatarImage(message.sender)} 
                    alt={message.sender}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory; 