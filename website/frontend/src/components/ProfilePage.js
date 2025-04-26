import React, { useState } from 'react';
import memo1 from '../assets/memo1.jpg';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'January 15, 2025',
    profilePicture: memo1,
    bio: 'I love using Mnemosyne to keep track of my memories and important people in my life.',
    stats: {
      memories: 24,
      connections: 12,
      conversations: 37
    },
    preferences: {
      darkMode: false,
      notifications: true,
      emailUpdates: false,
      autoBackup: true
    }
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    bio: user.bio
  });

  const toggleEditing = () => {
    if (isEditing) {
      // Save changes
      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        bio: editForm.bio
      });
    } else {
      // Reset form to current values
      setEditForm({
        name: user.name,
        email: user.email,
        bio: user.bio
      });
    }
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const togglePreference = (preference) => {
    setUser({
      ...user,
      preferences: {
        ...user.preferences,
        [preference]: !user.preferences[preference]
      }
    });
  };

  // Styles
  const pageStyle = {
    padding: '2rem',
    maxWidth: '800px',
    margin: '0 auto'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const headerTitleStyle = {
    fontSize: '2rem',
    marginBottom: '0.5rem'
  };

  const sectionStyle = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  };

  const profileHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  };

  const profilePictureStyle = {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #4a90e2'
  };

  const userInfoStyle = {
    flex: 1
  };

  const nameStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: '0 0 0.5rem 0'
  };

  const statContainerStyle = {
    display: 'flex',
    justifyContent: 'space-around',
    textAlign: 'center',
    marginTop: '1rem'
  };

  const statItemStyle = {
    padding: '0.5rem'
  };

  const statNumberStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#4a90e2'
  };

  const statLabelStyle = {
    fontSize: '0.9rem',
    color: '#666'
  };

  const sectionTitleStyle = {
    borderBottom: '1px solid #e0e0e0',
    paddingBottom: '0.5rem',
    marginBottom: '1rem'
  };

  const fieldGroupStyle = {
    marginBottom: '1rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const buttonStyle = {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold'
  };

  const switchContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f0f0f0'
  };

  const switchLabelStyle = {
    fontWeight: 'normal'
  };

  const switchStyle = (active) => ({
    width: '50px',
    height: '26px',
    backgroundColor: active ? '#4a90e2' : '#ccc',
    borderRadius: '13px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  });

  const switchHandleStyle = (active) => ({
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '3px',
    left: active ? '27px' : '3px',
    transition: 'left 0.3s'
  });

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <h2 style={headerTitleStyle}>Profile</h2>
      </div>

      <div style={sectionStyle}>
        <div style={profileHeaderStyle}>
          <img 
            src={user.profilePicture} 
            alt={user.name} 
            style={profilePictureStyle} 
          />
          <div style={userInfoStyle}>
            <h3 style={nameStyle}>{user.name}</h3>
            <p>{user.email}</p>
            <p>Member since: {user.joinDate}</p>
            <button 
              style={buttonStyle} 
              onClick={toggleEditing}
            >
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div style={statContainerStyle}>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{user.stats.memories}</div>
            <div style={statLabelStyle}>Memories</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{user.stats.connections}</div>
            <div style={statLabelStyle}>Connections</div>
          </div>
          <div style={statItemStyle}>
            <div style={statNumberStyle}>{user.stats.conversations}</div>
            <div style={statLabelStyle}>Conversations</div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Edit Profile</h3>
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={editForm.name} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={editForm.email} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="bio">Bio</label>
            <textarea 
              id="bio" 
              name="bio" 
              value={editForm.bio} 
              onChange={handleChange} 
              style={textareaStyle} 
            />
          </div>
        </div>
      ) : (
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>About Me</h3>
          <p>{user.bio}</p>
        </div>
      )}

      <div style={sectionStyle}>
        <h3 style={sectionTitleStyle}>Preferences</h3>
        <div style={switchContainerStyle}>
          <label style={switchLabelStyle}>Dark Mode</label>
          <div 
            style={switchStyle(user.preferences.darkMode)} 
            onClick={() => togglePreference('darkMode')}
          >
            <div style={switchHandleStyle(user.preferences.darkMode)}></div>
          </div>
        </div>
        <div style={switchContainerStyle}>
          <label style={switchLabelStyle}>Push Notifications</label>
          <div 
            style={switchStyle(user.preferences.notifications)} 
            onClick={() => togglePreference('notifications')}
          >
            <div style={switchHandleStyle(user.preferences.notifications)}></div>
          </div>
        </div>
        <div style={switchContainerStyle}>
          <label style={switchLabelStyle}>Email Updates</label>
          <div 
            style={switchStyle(user.preferences.emailUpdates)} 
            onClick={() => togglePreference('emailUpdates')}
          >
            <div style={switchHandleStyle(user.preferences.emailUpdates)}></div>
          </div>
        </div>
        <div style={switchContainerStyle}>
          <label style={switchLabelStyle}>Auto Backup</label>
          <div 
            style={switchStyle(user.preferences.autoBackup)} 
            onClick={() => togglePreference('autoBackup')}
          >
            <div style={switchHandleStyle(user.preferences.autoBackup)}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 