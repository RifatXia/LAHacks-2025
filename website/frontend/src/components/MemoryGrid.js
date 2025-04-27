import React, { useState, useEffect } from 'react';
import MemoryCard from './MemoryCard';
import MemoryUpload from './MemoryUpload';
import memo1 from '../assets/memo1.jpg';
import memo3 from '../assets/memo3.jpg';
import memo4 from '../assets/memo4.jpg';
import memo7 from '../assets/memo7.jpg';

const LOCAL_STORAGE_KEY = 'memoar_memories';

// Default images map for referencing when loading from storage
const DEFAULT_IMAGES = {
  memo1,
  memo3,
  memo4,
  memo7
};

const MemoryGrid = () => {
  const [memories, setMemories] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Prepare default memory data
  const getDefaultMemories = () => [
    { id: 1, imageRef: 'memo1', fileType: 'image', date: '2023-05-15', description: 'Family vacation in Hawaii' },
    { id: 2, imageRef: 'memo3', fileType: 'image', date: '2023-08-22', description: 'Graduation day' },
    { id: 3, imageRef: 'memo4', fileType: 'image', date: '2023-12-25', description: 'Christmas dinner' },
    { id: 4, imageRef: 'memo7', fileType: 'image', date: '2024-01-01', description: 'New Year celebration' },
    { id: 5, imageRef: 'memo1', fileType: 'image', date: '2024-02-14', description: 'Valentine\'s day' }
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
        setMemories(JSON.parse(saved));
      } else {
        setMemories(getDefaultMemories());
      }
    } catch (err) {
      console.error("Error loading memories from localStorage:", err);
      setMemories(getDefaultMemories());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      // Only save if there are memories to save
      if (memories.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memories));
      }
    } catch (err) {
      console.error("Error saving to localStorage:", err);
      alert("Storage error: Your browser may have run out of storage space. Some data may not be saved.");
    }
  }, [memories]);
  
  const addMemory = (newMemory) => {
    try {
      // For newly uploaded memories, save the actual data
      const memory = {
        id: Date.now(),
        imageRef: newMemory.file, // Store the data URL directly for user-uploaded images
        fileType: newMemory.fileType,
        date: newMemory.date,
        description: newMemory.description
      };
      
      const updatedMemories = [...memories, memory];
      setMemories(updatedMemories);
      setShowUploadForm(false);
      
      // Try to save right away to catch any storage errors
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMemories));
      } catch (err) {
        console.error("Error saving new memory:", err);
        alert("Your browser ran out of storage space. Try using smaller images.");
      }
    } catch (err) {
      console.error("Error adding memory:", err);
    }
  };
  
  const viewMemory = (memory) => {
    setSelectedMemory(memory);
  };
  
  const closeMemoryView = () => {
    setSelectedMemory(null);
  };
  
  // Add delete memory functionality
  const deleteMemory = (id, event) => {
    // Stop event propagation to prevent opening the memory details
    event.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this memory?')) {
      const updatedMemories = memories.filter(memory => memory.id !== id);
      setMemories(updatedMemories);
      
      // If the deleted memory is currently selected, close the detail view
      if (selectedMemory && selectedMemory.id === id) {
        setSelectedMemory(null);
      }
      
      // Update localStorage
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedMemories));
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

  const quoteStyle = {
    fontStyle: 'italic',
    color: '#666'
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

  const detailImageStyle = {
    width: '100%',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: '4px'
  };

  const detailInfoStyle = {
    marginTop: '1rem'
  };

  const detailDateStyle = {
    fontWeight: 'bold',
    marginBottom: '0.5rem'
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

  const renderSelectedMemoryContent = () => {
    if (!selectedMemory) return null;

    switch (selectedMemory.fileType) {
      case 'audio':
        return (
          <div style={{ 
            textAlign: 'center', 
            backgroundColor: '#f0f0f0', 
            padding: '2rem',
            borderRadius: '4px'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎵</div>
            <audio 
              controls 
              src={getImageUrl(selectedMemory.imageRef)} 
              style={{ width: '100%' }} 
            />
          </div>
        );
      case 'video':
        return (
          <video 
            controls 
            src={getImageUrl(selectedMemory.imageRef)} 
            style={detailImageStyle} 
          />
        );
      case 'image':
      default:
        return (
          <img 
            src={getImageUrl(selectedMemory.imageRef)} 
            alt="Memory" 
            style={detailImageStyle}
          />
        );
    }
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={headerTitleStyle}>Memories</h2>
        <p style={quoteStyle}>"Nothing is ever really lost to us as long as we remember it."</p>
        {loading && <p>Loading memories...</p>}
      </div>
      
      <div style={gridStyle}>
        <div 
          style={addCardStyle} 
          onClick={() => setShowUploadForm(true)}
        >
          <div style={addIconStyle}>+</div>
          <p>Add new Memory</p>
        </div>
        
        {memories.map(memory => (
          <div key={memory.id} style={cardContainerStyle}>
            <div onClick={() => viewMemory(memory)}>
              <MemoryCard 
                memory={{
                  ...memory,
                  // Convert imageRef to actual image URL for the card
                  image: getImageUrl(memory.imageRef)
                }} 
              />
            </div>
            <button 
              style={deleteButtonStyle}
              onClick={(e) => deleteMemory(memory.id, e)}
              title="Delete memory"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      
      {showUploadForm && (
        <div style={overlayStyle}>
          <MemoryUpload 
            onAdd={addMemory} 
            onCancel={() => setShowUploadForm(false)} 
          />
        </div>
      )}
      
      {selectedMemory && (
        <div style={overlayStyle} onClick={closeMemoryView}>
          <div 
            style={detailStyle} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              style={closeButtonStyle} 
              onClick={closeMemoryView}
            >
              ×
            </button>
            
            {renderSelectedMemoryContent()}
            
            <div style={detailInfoStyle}>
              <p style={detailDateStyle}>Date: {selectedMemory.date}</p>
              <p>{selectedMemory.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGrid; 