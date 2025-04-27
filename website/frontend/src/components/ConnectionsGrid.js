import React, { useState, useEffect } from 'react';
import ConnectionCard from './ConnectionCard';
import ConnectionUpload from './ConnectionUpload';
import memo1 from '../assets/memo1.jpg';
import memo3 from '../assets/memo3.jpg';
import memo4 from '../assets/memo4.jpg';
import memo7 from '../assets/memo7.jpg';

const LOCAL_STORAGE_KEY = 'memoar_connections';

// Default images map for referencing when loading from storage
const DEFAULT_IMAGES = {
  memo1,
  memo3,
  memo4,
  memo7
};

const ConnectionsGrid = () => {
  const [connections, setConnections] = useState([]);
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Prepare default connection data
  const getDefaultConnections = () => [
    { 
      id: 1, 
      name: 'John Doe', 
      relationship: 'Father', 
      dateOfBirth: '1975-06-10',
      imageRefs: ['memo1', 'memo3', 'memo4', 'memo7', 'memo1']
    },
    { 
      id: 2, 
      name: 'Jane Doe', 
      relationship: 'Mother', 
      dateOfBirth: '1978-03-22',
      imageRefs: ['memo3', 'memo4', 'memo7', 'memo1', 'memo3']
    },
    { 
      id: 3, 
      name: 'Emily Doe', 
      relationship: 'Sister', 
      dateOfBirth: '2005-12-15',
      imageRefs: ['memo4', 'memo7', 'memo1', 'memo3', 'memo4']
    },
    { 
      id: 4, 
      name: 'Max', 
      relationship: 'Dog', 
      dateOfBirth: '2018-05-03',
      imageRefs: ['memo7', 'memo1', 'memo3', 'memo4', 'memo7']
    }
  ];
  
  // Function to get actual image URL from reference or data URL
  const getImageUrl = (imageRef) => {
    // If it's a default image reference
    if (typeof imageRef === 'string' && DEFAULT_IMAGES[imageRef]) {
      return DEFAULT_IMAGES[imageRef];
    }
    // Otherwise it's already a dataURL from an upload
    return imageRef;
  };
  
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setConnections(JSON.parse(saved));
      } else {
        setConnections(getDefaultConnections());
      }
    } catch (err) {
      console.error("Error loading connections from localStorage:", err);
      setConnections(getDefaultConnections());
    }
  }, []);

  useEffect(() => {
    try {
      // Only save if there are connections to save
      if (connections.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(connections));
      }
    } catch (err) {
      console.error("Error saving to localStorage:", err);
      alert("Storage error: Your browser may have run out of storage space. Some data may not be saved.");
    }
  }, [connections]);

  const addConnection = (newConnection) => {
    try {
      // Convert newConnection.images array to have actual image data
      // For newly uploaded connections, save the actual image URLs
      const connection = { 
        id: Date.now(), 
        name: newConnection.name,
        relationship: newConnection.relationship,
        dateOfBirth: newConnection.dateOfBirth,
        // Just use the images as they come from the form
        imageRefs: newConnection.images 
      };
      
      const updatedConnections = [...connections, connection];
      setConnections(updatedConnections);
      setShowUploadForm(false);
      
      // Try to save right away to catch any storage errors
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedConnections));
      } catch (err) {
        console.error("Error saving new connection:", err);
        alert("Your browser ran out of storage space. Try using smaller images.");
      }
    } catch (err) {
      console.error("Error adding connection:", err);
    }
  };
  
  const viewConnection = (connection) => {
    setSelectedConnection(connection);
    setCurrentImageIndex(0);
  };
  
  const closeConnectionView = () => {
    setSelectedConnection(null);
  };

  const nextImage = () => {
    if (selectedConnection && selectedConnection.imageRefs) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === selectedConnection.imageRefs.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedConnection && selectedConnection.imageRefs) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? selectedConnection.imageRefs.length - 1 : prevIndex - 1
      );
    }
  };

  // Add delete connection functionality
  const deleteConnection = (id, event) => {
    // Stop event propagation to prevent opening the connection details
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this connection?')) {
      const updatedConnections = connections.filter(conn => conn.id !== id);
      setConnections(updatedConnections);
      
      // If the deleted connection is currently selected, close the detail view
      if (selectedConnection && selectedConnection.id === id) {
        setSelectedConnection(null);
      }
      
      // Update localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedConnections));
      } catch (err) {
        console.error("Error saving after delete:", err);
      }
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

  // Add styles for delete button
  const deleteButtonStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '25px',
    height: '25px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 2,
    fontSize: '14px',
    fontWeight: 'bold'
  };
  
  const cardContainerStyle = {
    position: 'relative'
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
        
        {connections.map(connection => (
          <div key={connection.id} style={cardContainerStyle}>
            <div onClick={() => viewConnection(connection)}>
              <ConnectionCard 
                connection={{
                  ...connection,
                  // Convert imageRefs to actual image URLs for the card
                  image: getImageUrl(connection.imageRefs ? connection.imageRefs[0] : null) || memo1
                }} 
              />
            </div>
            <button 
              style={deleteButtonStyle}
              onClick={(e) => deleteConnection(connection.id, e)}
              title="Delete connection"
            >
              ×
            </button>
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
                src={getImageUrl(selectedConnection.imageRefs ? 
                  selectedConnection.imageRefs[currentImageIndex] : null)} 
                alt={selectedConnection.name} 
                style={detailImageStyle}
              />
              <button style={rightArrowStyle} onClick={nextImage}>
                ›
              </button>
            </div>
            
            <div style={imagePaginationStyle}>
              {(selectedConnection.imageRefs || []).map((_, index) => (
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
                <span>{selectedConnection.relationship}</span>
              </div>
              {selectedConnection.dateOfBirth && (
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Date of Birth:</span>
                  <span>{selectedConnection.dateOfBirth}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConnectionsGrid; 