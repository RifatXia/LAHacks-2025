import React, { useState } from 'react';
import MemoryCard from './MemoryCard';
import MemoryUpload from './MemoryUpload';
import memo1 from '../assets/memo1.jpg';
import memo3 from '../assets/memo3.jpg';
import memo4 from '../assets/memo4.jpg';
import memo7 from '../assets/memo7.jpg';

const MemoryGrid = () => {
  const [memories, setMemories] = useState([
    { id: 1, image: memo1, fileType: 'image', date: '2023-05-15', description: 'Family vacation in Hawaii' },
    { id: 2, image: memo3, fileType: 'image', date: '2023-08-22', description: 'Graduation day' },
    { id: 3, image: memo4, fileType: 'image', date: '2023-12-25', description: 'Christmas dinner' },
    { id: 4, image: memo7, fileType: 'image', date: '2024-01-01', description: 'New Year celebration' },
    { id: 5, image: memo1, fileType: 'image', date: '2024-02-14', description: 'Valentine\'s day' }
  ]);
  
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState(null);
  
  const addMemory = (newMemory) => {
    const memory = {
      id: Date.now(),
      ...newMemory
    };
    setMemories([...memories, memory]);
    setShowUploadForm(false);
  };
  
  const viewMemory = (memory) => {
    setSelectedMemory(memory);
  };
  
  const closeMemoryView = () => {
    setSelectedMemory(null);
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
              src={selectedMemory.file} 
              style={{ width: '100%' }} 
            />
          </div>
        );
      case 'video':
        return (
          <video 
            controls 
            src={selectedMemory.file} 
            style={detailImageStyle} 
          />
        );
      case 'image':
      default:
        return (
          <img 
            src={selectedMemory.file || selectedMemory.image} 
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
          <div key={memory.id} onClick={() => viewMemory(memory)}>
            <MemoryCard memory={memory} />
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