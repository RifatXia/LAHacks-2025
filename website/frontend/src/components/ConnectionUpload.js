import React, { useState } from 'react';

const ConnectionUpload = ({ onAdd, onCancel }) => {
  const [images, setImages] = useState([null, null, null, null, null]);
  const [previewUrls, setPreviewUrls] = useState(['', '', '', '', '']);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
      
      // Create a compressed preview URL
      compressImage(file, 800, (compressedDataUrl) => {
        const newPreviewUrls = [...previewUrls];
        newPreviewUrls[index] = compressedDataUrl;
        setPreviewUrls(newPreviewUrls);
      });
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
        
        // Get compressed image as data URL
        // Adjust quality (0.7 = 70% quality) to balance size and quality
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        callback(compressedDataUrl);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if all images are uploaded
    if (images.some(img => img === null)) {
      alert('Please upload all 5 images');
      return;
    }

    if (!name || !relationship) {
      alert('Please fill all required fields');
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('relation', relationship);
    images.forEach((img, idx) => {
      formData.append(`image${idx + 1}`, img);
    });

    try {
      const response = await fetch('https://4449-164-67-70-232.ngrok-free.app/set_connection', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to save connection');
      }

      // Optionally, you can get the new connection from the response
      // const newConnection = await response.json();

      // Call onAdd to update the UI (you may want to refetch or optimistically update)
      onAdd({
        images: previewUrls,
        name,
        relation: relationship
      });
    } catch (error) {
      alert(error.message || 'Failed to save connection');
    }
  };

  const containerStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  };

  const imageGalleryStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  };

  const imagePreviewContainerStyle = {
    position: 'relative',
    width: '250px',
    height: '250px'
  };

  const uploadPlaceholderStyle = {
    width: '100%',
    height: '100%',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  };

  const previewStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '8px',
    overflow: 'hidden',
    position: 'relative'
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
    backgroundColor: active ? '#333' : '#ccc',
    cursor: 'pointer'
  });

  const imageStatusStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginTop: '0.5rem'
  };

  const statusTextStyle = {
    fontSize: '0.9rem',
    color: '#666'
  };

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

  const imageCounterStyle = {
    padding: '0.5rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    borderRadius: '4px',
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '0.8rem',
    zIndex: 2
  };

  const arrowButtonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    width: '30px',
    height: '30px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    cursor: 'pointer',
    zIndex: 2
  };

  const leftArrowStyle = {
    ...arrowButtonStyle,
    left: '10px'
  };

  const rightArrowStyle = {
    ...arrowButtonStyle,
    right: '10px'
  };

  const uploadedCount = images.filter(img => img !== null).length;

  const switchImage = (index) => {
    setCurrentImageIndex(index);
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % 5);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? 4 : prevIndex - 1));
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Add New Connection</h3>
      <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666' }}>
        Upload 5 photos to create a connection
      </p>
      
      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={imageGalleryStyle}>
          <div style={imagePreviewContainerStyle}>
            <div style={imageCounterStyle}>
              {uploadedCount} of 5 images
            </div>
            
            {previewUrls[currentImageIndex] ? (
              <>
                <div style={previewStyle}>
                  <img 
                    src={previewUrls[currentImageIndex]} 
                    alt="Preview" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>
                {uploadedCount > 1 && (
                  <>
                    <button type="button" style={leftArrowStyle} onClick={prevImage}>
                      ‹
                    </button>
                    <button type="button" style={rightArrowStyle} onClick={nextImage}>
                      ›
                    </button>
                  </>
                )}
              </>
            ) : (
              <div 
                style={uploadPlaceholderStyle} 
                onClick={() => document.getElementById(`connection-image-${currentImageIndex}`).click()}
              >
                <div style={{ fontSize: '2.5rem', lineHeight: 1, color: '#666', marginBottom: '0.5rem' }}>+</div>
                <p>Upload photo {currentImageIndex + 1} of 5</p>
              </div>
            )}
          </div>
          
          <div style={imagePaginationStyle}>
            {[0, 1, 2, 3, 4].map((index) => (
              <div 
                key={index} 
                style={paginationDotStyle(index === currentImageIndex)}
                onClick={() => switchImage(index)}
              />
            ))}
          </div>
          
          <div style={imageStatusStyle}>
            <span style={statusTextStyle}>
              {uploadedCount === 5 ? (
                "All photos uploaded ✓"
              ) : (
                `${5 - uploadedCount} more ${5 - uploadedCount === 1 ? 'photo' : 'photos'} required`
              )}
            </span>
          </div>
          
          {/* Hidden file inputs for each image */}
          {[0, 1, 2, 3, 4].map((index) => (
            <input 
              key={index}
              type="file" 
              id={`connection-image-${index}`} 
              accept="image/*" 
              onChange={(e) => handleImageChange(e, index)} 
              style={{ display: 'none' }}
            />
          ))}
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="name" style={labelStyle}>Name:</label>
          <input 
            type="text" 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            style={inputStyle}
            placeholder="Enter name"
          />
        </div>

        <div style={formGroupStyle}>
          <label htmlFor="relationship" style={labelStyle}>Relationship:</label>
          <input 
            type="text" 
            id="relationship" 
            value={relationship} 
            onChange={(e) => setRelationship(e.target.value)} 
            required 
            style={inputStyle}
            placeholder="Family member, Friend, etc."
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
            disabled={uploadedCount < 5}
          >
            Save Connection
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConnectionUpload; 