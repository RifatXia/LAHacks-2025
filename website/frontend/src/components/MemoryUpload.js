import React, { useState } from 'react';

const MemoryUpload = ({ onAdd, onCancel }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(''); // 'image', 'audio', or 'video'
  const [previewUrl, setPreviewUrl] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Determine file type
      if (selectedFile.type.startsWith('image/')) {
        setFileType('image');
        // Compress image before preview for images
        compressImage(selectedFile, 800, (compressedDataUrl) => {
          setPreviewUrl(compressedDataUrl);
        });
      } else if (selectedFile.type.startsWith('audio/')) {
        setFileType('audio');
        // For non-image files, use regular FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type.startsWith('video/')) {
        setFileType('video');
        // For non-image files, use regular FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      }
    }
  };

  // Function to compress images before storing them
  const compressImage = (file, maxWidth, callback) => {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get compressed image as data URL (0.7 = 70% quality)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedDataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !date || !description) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    setUploadError(null);

    try {
      onAdd({
        file: previewUrl, // Using the compressed version for images
        fileType,
        date,
        description
      });
    } catch (error) {
      console.error('Error adding memory:', error);
      setUploadError(error.message);
      setIsSubmitting(false);
    }
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

  // Add error message display style
  const errorStyle = {
    color: 'red',
    padding: '0.5rem',
    marginTop: '1rem',
    textAlign: 'center',
    backgroundColor: '#ffeeee',
    borderRadius: '4px',
    fontSize: '0.9rem'
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

        {uploadError && (
          <div style={errorStyle}>
            {uploadError}
          </div>
        )}

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
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            style={{
              ...saveButtonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemoryUpload; 