import React, { useState, useEffect } from 'react';
import ConnectionCard from './ConnectionCard';
import ConnectionUpload from './ConnectionUpload';
import memo1 from '../assets/memo1.jpg';
import memo3 from '../assets/memo3.jpg';
import memo4 from '../assets/memo4.jpg';
import memo7 from '../assets/memo7.jpg';

const ConnectionsGrid = () => {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/get_connection')
      .then(res => res.json())
      .then(data => {
        // Transform API data to match expected structure
        const transformed = data.map((conn) => {
          let images = [];
          if (
            conn.image &&
            typeof conn.image.data === 'string' &&
            conn.image.data.length > 0
          ) {
            images = [
              `data:${conn.image.content_type || 'image/jpeg'};base64,${conn.image.data}`
            ];
          }
          return {
            name: conn.name,
            relation: conn.relation,
            images
          };
        });
        setConnections(transformed);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch connections:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading connections...</div>;
  }

  const addConnection = (newConnection) => {
    const connection = {
      id: Date.now(),
      ...newConnection
    };
    setConnections([...connections, connection]);
    setShowUploadForm(false);
  };
  
  const viewConnection = (connection) => {
    setSelectedConnection(connection);
    setCurrentImageIndex(0);
  };
  
  const closeConnectionView = () => {
    setSelectedConnection(null);
  };

  const nextImage = () => {
    if (selectedConnection) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedConnection.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedConnection) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedConnection.images.length - 1 : prevIndex - 1
      );
    }
  };

  // Styles
  const pageStyle = {
    padding: '2rem'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const headerTitleStyle = {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem'
  };

  const addCardStyle = {
    border: '2px dashed #ccc',
    height: '200px',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };

  const addIconStyle = {
    fontSize: '3rem',
    lineHeight: '1',
    color: '#666'
  };

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };

  const detailStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    position: 'relative'
  };

  const imageContainerStyle = {
    position: 'relative',
    width: '100%',
    height: '400px'
  };

  const detailImageStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '4px'
  };

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    cursor: 'pointer',
    zIndex: 1
  };

  const leftArrowStyle = {
    ...arrowButtonStyle,
    left: '10px'
  };

  const rightArrowStyle = {
    ...arrowButtonStyle,
    right: '10px'
  };

  const imagePaginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };

  const paginationDotStyle = (active) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: active ? '#333' : '#ccc'
  });

  const detailInfoStyle = {
    marginTop: '1rem'
  };

  const infoRowStyle = {
    display: 'flex',
    marginBottom: '0.5rem'
  };

  const infoLabelStyle = {
    fontWeight: 'bold',
    minWidth: '120px'
  };

  const closeButtonStyle = {
    position: 'absolute',
    right: '1rem',
    top: '1rem',
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer'
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={headerTitleStyle}>We are Family!</h2>
      </div>
      
      <div style={gridStyle}>
        <div 
          style={addCardStyle} 
          onClick={() => setShowUploadForm(true)}
        >
          <div style={addIconStyle}>+</div>
          <p>Add Connection</p>
        </div>
        
        {connections.map((conn, idx) => (
          <div key={idx} style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            {conn.images.length > 0 ? (
              <img
                src={conn.images[0]}
                alt={conn.name}
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }}
              />
            ) : (
              <div style={{
                width: '100%',
                height: '200px',
                background: '#eee',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#aaa'
              }}>
                No Image
              </div>
            )}
            <h3 style={{ margin: '1rem 0 0.5rem 0' }}>{conn.name}</h3>
            <p style={{ margin: 0, color: '#555' }}>{conn.relation}</p>
          </div>
        ))}
      </div>
      
      {showUploadForm && (
        <div style={overlayStyle}>
          <ConnectionUpload 
            onAdd={addConnection} 
            onCancel={() => setShowUploadForm(false)} 
          />
        </div>
      )}
      
      {selectedConnection && (
        <div style={overlayStyle} onClick={closeConnectionView}>
          <div 
            style={detailStyle} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={closeButtonStyle} 
              onClick={closeConnectionView}
            >
              ×
            </button>
            
            <div style={imageContainerStyle}>
              <button style={leftArrowStyle} onClick={prevImage}>
                ‹
              </button>
              <img 
                src={selectedConnection.images[currentImageIndex]} 
                alt={selectedConnection.name} 
                style={detailImageStyle}
              />
              <button style={rightArrowStyle} onClick={nextImage}>
                ›
              </button>
            </div>
            
            <div style={imagePaginationStyle}>
              {selectedConnection.images.map((_, index) => (
                <div 
                  key={index} 
                  style={paginationDotStyle(index === currentImageIndex)}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
            
            <div style={detailInfoStyle}>
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Name:</span>
                <span>{selectedConnection.name}</span>
              </div>
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Relationship:</span>
                <span>{selectedConnection.relation}</span>
              </div>
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Date of Birth:</span>
                <span>{selectedConnection.dateOfBirth}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsGrid; 