import React, { useState } from 'react';

const MemoryUpload = ({ onAdd, onCancel }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(''); // 'image', 'audio', or 'video'
  const [previewUrl, setPreviewUrl] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Determine file type
      if (selectedFile.type.startsWith('image/')) {
        setFileType('image');
      } else if (selectedFile.type.startsWith('audio/')) {
        setFileType('audio');
      } else if (selectedFile.type.startsWith('video/')) {
        setFileType('video');
      }
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !date || !description) {
      alert('Please fill all required fields');
      return;
    }

    onAdd({
      file: previewUrl, // In a real app, you'd upload this to a server
      fileType,
      date,
      description
    });
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const uploadContainerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  };

  const uploadPlaceholderStyle = {
    width: '200px',
    height: '200px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };

  const previewContainerStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0'
  };

  const fileTypeTabsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '1rem'
  };

  const fileTypeTabStyle = (active) => ({
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: active ? '#4a90e2' : '#e0e0e0',
    color: active ? 'white' : 'black',
    borderRadius: '4px',
    cursor: 'pointer'
  });

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  };

  const labelStyle = {
    fontWeight: 'bold'
  };

  const inputStyle = {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem'
  };

  const cancelButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: 'transparent',
    border: '1px solid #ccc'
  };

  const saveButtonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    backgroundColor: '#4a90e2',
    border: 'none',
    color: 'white'
  };

  const renderPreview = () => {
    if (!previewUrl) return null;
    
    switch (fileType) {
      case 'image':
        return (
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        );
      case 'audio':
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎵</div>
            <audio controls src={previewUrl} style={{ width: '100%' }} />
          </div>
        );
      case 'video':
        return (
          <video 
            controls 
            src={previewUrl} 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Add New Memory</h3>
      
      <div style={fileTypeTabsStyle}>
        <button 
          style={fileTypeTabStyle(!file || fileType === 'image')}
          onClick={() => document.getElementById('file-input-image').click()}
        >
          Image
        </button>
        <button 
          style={fileTypeTabStyle(fileType === 'audio')}
          onClick={() => document.getElementById('file-input-audio').click()}
        >
          Audio
        </button>
        <button 
          style={fileTypeTabStyle(fileType === 'video')}
          onClick={() => document.getElementById('file-input-video').click()}
        >
          Video
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={uploadContainerStyle}>
          {previewUrl ? (
            <div style={previewContainerStyle}>
              {renderPreview()}
            </div>
          ) : (
            <div 
              style={uploadPlaceholderStyle} 
              onClick={() => document.getElementById('file-input-image').click()}
            >
              <div style={{ fontSize: '2.5rem', lineHeight: 1, color: '#666', marginBottom: '0.5rem' }}>+</div>
              <p>Upload from photo/files</p>
            </div>
          )}
          <input 
            type="file" 
            id="file-input-image" 
            accept="image/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />
          <input 
            type="file" 
            id="file-input-audio" 
            accept="audio/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />
          <input 
            type="file" 
            id="file-input-video" 
            accept="video/*" 
            onChange={handleFileChange} 
            style={{ display: 'none' }}
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="date" style={labelStyle}>Date *</label>
          <input 
            type="date" 
            id="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            style={inputStyle} 
            required 
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="description" style={labelStyle}>Description *</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            style={textareaStyle} 
            required 
          />
        </div>

        <div style={buttonContainerStyle}>
          <button 
            type="button" 
            onClick={onCancel} 
            style={cancelButtonStyle}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={saveButtonStyle}
          >
            Save Memory
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemoryUpload; 