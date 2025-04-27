import React from 'react';

const Navbar = ({ activePage, onPageChange }) => {
  return (
    <nav style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e0e0e0'
    }}>
      <div>
        <h1 style={{
          fontFamily: 'sans-serif',
          fontSize: '2rem',
          margin: 0,
          color: '#000',
          fontStyle: 'italic',
          fontWeight: 'bold'
        }}>MemoAR</h1>
      </div>
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '2rem',
        margin: 0,
        padding: 0
      }}>
        <li style={{ fontWeight: activePage === 'memory' ? 'bold' : 'normal' }}>
          <button 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderBottom: activePage === 'memory' ? '2px solid #000' : 'none'
            }}
            onClick={() => onPageChange('memory')}
          >
            Memory
          </button>
        </li>
        <li style={{ fontWeight: activePage === 'connections' ? 'bold' : 'normal' }}>
          <button 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderBottom: activePage === 'connections' ? '2px solid #000' : 'none'
            }}
            onClick={() => onPageChange('connections')}
          >
            Connections
          </button>
        </li>
        <li style={{ fontWeight: activePage === 'history' ? 'bold' : 'normal' }}>
          <button 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderBottom: activePage === 'history' ? '2px solid #000' : 'none'
            }}
            onClick={() => onPageChange('history')}
          >
            History
          </button>
        </li>
        <li style={{ fontWeight: activePage === 'profile' ? 'bold' : 'normal' }}>
          <button 
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderBottom: activePage === 'profile' ? '2px solid #000' : 'none'
            }}
            onClick={() => onPageChange('profile')}
          >
            Profile
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar; 