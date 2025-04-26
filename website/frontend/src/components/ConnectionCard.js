import React from 'react';

const ConnectionCard = ({ connection }) => {
  return (
    <div style={{
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}>
      <div style={{
        width: '100%',
        height: '150px',
        overflow: 'hidden'
      }}>
        <img 
          src={connection.images[0]} 
          alt={connection.name} 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      </div>
      <div style={{
        padding: '0.75rem',
        backgroundColor: 'white'
      }}>
        <p style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          margin: '0 0 0.25rem 0',
          textAlign: 'center'
        }}>{connection.name}</p>
        <p style={{
          fontSize: '0.9rem',
          color: '#666',
          margin: 0,
          textAlign: 'center'
        }}>{connection.relationship}</p>
      </div>
    </div>
  );
};

export default ConnectionCard; 