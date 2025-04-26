import React from 'react';

const MemoryCard = ({ memory }) => {
  const renderMediaContent = () => {
    switch (memory.fileType) {
      case 'audio':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            backgroundColor: '#f0f0f0'
          }}>
            <div style={{ fontSize: '3rem' }}>🎵</div>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem' }}>Audio</p>
          </div>
        );
      case 'video':
        return (
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%'
          }}>
            <video 
              src={memory.file} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: '2rem',
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              ▶
            </div>
          </div>
        );
      case 'image':
      default:
        return (
          <img 
            src={memory.file || memory.image} 
            alt={memory.description} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        );
    }
  };

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
        {renderMediaContent()}
      </div>
      <div style={{
        padding: '0.75rem',
        backgroundColor: 'white'
      }}>
        <p style={{
          fontSize: '0.9rem',
          color: '#666',
          margin: 0,
          textAlign: 'center'
        }}>{memory.date}</p>
      </div>
    </div>
  );
};

export default MemoryCard; 