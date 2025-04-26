import React, { useState } from 'react';
import memo1 from '../assets/memo1.jpg';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Ethan Mitchell',
    email: 'ethan.mitchell@example.com',
    age: 63,
    gender: 'Male',
    joinDate: 'January 15, 2025',
    profilePicture: memo1,
    bio: 'Software developer with over 30 years of experience. I enjoy listening to podcasts during my commute and working on side projects in the evening.',
    stats: {
      memories: 24,
      connections: 12,
      conversations: 37
    }
  });
  
  const [schedule, setSchedule] = useState([
    { id: 1, time: '6:30 AM - 7:00 AM', activity: 'Wake up, quick stretching, morning hygiene' },
    { id: 2, time: '7:00 AM - 7:45 AM', activity: 'Light breakfast (coffee + oatmeal) and news reading' },
    { id: 3, time: '8:00 AM - 9:00 AM', activity: 'Commute to work (listens to podcasts)' },
    { id: 4, time: '9:00 AM - 12:30 PM', activity: 'Work (Software Development tasks, coding, team stand-up meeting at 10:00 AM)' },
    { id: 5, time: '12:30 PM - 1:30 PM', activity: 'Lunch break (usually eats with colleagues at nearby café)' },
    { id: 6, time: '1:30 PM - 5:30 PM', activity: 'Work (client meetings, feature development, code reviews)' },
    { id: 7, time: '5:30 PM - 6:30 PM', activity: 'Gym workout (weight training + cardio)' },
    { id: 8, time: '6:30 PM - 7:00 PM', activity: 'Commute back home' },
    { id: 9, time: '7:00 PM - 8:00 PM', activity: 'Dinner (home-cooked or takeout) while watching TV series' },
    { id: 10, time: '8:00 PM - 9:30 PM', activity: 'Personal time (gaming, reading, working on side projects)' },
    { id: 11, time: '9:30 PM - 10:00 PM', activity: 'Prepare for the next day (lay out clothes, light journaling)' },
    { id: 12, time: '10:00 PM', activity: 'Sleep' }
  ]);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    gender: user.gender,
    bio: user.bio
  });

  const [isAddingScheduleItem, setIsAddingScheduleItem] = useState(false);
  const [editingScheduleItem, setEditingScheduleItem] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    time: '',
    activity: ''
  });

  const toggleEditing = () => {
    if (isEditing) {
      // Save changes
      setUser({
        ...user,
        name: editForm.name,
        email: editForm.email,
        age: editForm.age,
        gender: editForm.gender,
        bio: editForm.bio
      });
    } else {
      // Reset form to current values
      setEditForm({
        name: user.name,
        email: user.email,
        age: user.age,
        gender: user.gender,
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

  const handleScheduleFormChange = (e) => {
    const { name, value } = e.target;
    setScheduleForm({
      ...scheduleForm,
      [name]: value
    });
  };

  const addScheduleItem = () => {
    if (!scheduleForm.time || !scheduleForm.activity) return;
    
    const newItem = {
      id: Date.now(),
      time: scheduleForm.time,
      activity: scheduleForm.activity
    };
    
    setSchedule([...schedule, newItem]);
    setScheduleForm({ time: '', activity: '' });
    setIsAddingScheduleItem(false);
  };

  const updateScheduleItem = () => {
    if (!scheduleForm.time || !scheduleForm.activity || !editingScheduleItem) return;
    
    const updatedSchedule = schedule.map(item => 
      item.id === editingScheduleItem.id 
        ? { ...item, time: scheduleForm.time, activity: scheduleForm.activity }
        : item
    );
    
    setSchedule(updatedSchedule);
    setScheduleForm({ time: '', activity: '' });
    setEditingScheduleItem(null);
  };

  const startEditScheduleItem = (item) => {
    setEditingScheduleItem(item);
    setScheduleForm({
      time: item.time,
      activity: item.activity
    });
    setIsAddingScheduleItem(false);
  };

  const deleteScheduleItem = (id) => {
    const updatedSchedule = schedule.filter(item => item.id !== id);
    setSchedule(updatedSchedule);
    
    if (editingScheduleItem && editingScheduleItem.id === id) {
      setEditingScheduleItem(null);
      setScheduleForm({ time: '', activity: '' });
    }
  };

  const cancelScheduleEdit = () => {
    setEditingScheduleItem(null);
    setIsAddingScheduleItem(false);
    setScheduleForm({ time: '', activity: '' });
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
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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

  const smallButtonStyle = {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginLeft: '0.5rem'
  };

  const scheduleItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    borderBottom: '1px solid #f0f0f0'
  };

  const scheduleTimeStyle = {
    fontWeight: 'bold',
    minWidth: '150px'
  };

  const scheduleActivityStyle = {
    flex: 1,
    padding: '0 1rem'
  };

  const scheduleActionStyle = {
    display: 'flex',
    gap: '0.5rem'
  };

  const iconButtonStyle = {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    fontSize: '1.2rem'
  };

  const scheduleFormStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    marginBottom: '1rem'
  };

  const scheduleFormRowStyle = {
    display: 'flex',
    gap: '1rem'
  };

  const addScheduleButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.9rem',
    cursor: 'pointer'
  };

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
            <p>{user.gender}, {user.age} years old</p>
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
            <label style={labelStyle} htmlFor="age">Age</label>
            <input 
              type="number" 
              id="age" 
              name="age" 
              value={editForm.age} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="gender">Gender</label>
            <input 
              type="text" 
              id="gender" 
              name="gender" 
              value={editForm.gender} 
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
        <div style={sectionTitleStyle}>
          <h3 style={{margin: 0}}>Daily Schedule</h3>
          {!isAddingScheduleItem && !editingScheduleItem && (
            <button 
              style={addScheduleButtonStyle}
              onClick={() => setIsAddingScheduleItem(true)}
            >
              <span>+</span> Add Activity
            </button>
          )}
        </div>

        {(isAddingScheduleItem || editingScheduleItem) && (
          <div style={scheduleFormStyle}>
            <h4>{editingScheduleItem ? 'Edit Activity' : 'Add New Activity'}</h4>
            <div style={scheduleFormRowStyle}>
              <div style={{flex: 1}}>
                <label style={labelStyle} htmlFor="time">Time</label>
                <input 
                  type="text" 
                  id="time" 
                  name="time" 
                  placeholder="e.g. 8:00 AM - 9:00 AM"
                  value={scheduleForm.time} 
                  onChange={handleScheduleFormChange} 
                  style={inputStyle} 
                />
              </div>
              <div style={{flex: 2}}>
                <label style={labelStyle} htmlFor="activity">Activity</label>
                <input 
                  type="text" 
                  id="activity" 
                  name="activity" 
                  placeholder="Describe the activity"
                  value={scheduleForm.activity} 
                  onChange={handleScheduleFormChange} 
                  style={inputStyle} 
                />
              </div>
            </div>
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button 
                style={{...smallButtonStyle, backgroundColor: '#ccc'}}
                onClick={cancelScheduleEdit}
              >
                Cancel
              </button>
              <button 
                style={smallButtonStyle}
                onClick={editingScheduleItem ? updateScheduleItem : addScheduleItem}
              >
                {editingScheduleItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        )}

        <div>
          {schedule.map(item => (
            <div key={item.id} style={scheduleItemStyle}>
              <div style={scheduleTimeStyle}>{item.time}</div>
              <div style={scheduleActivityStyle}>{item.activity}</div>
              <div style={scheduleActionStyle}>
                <button 
                  style={iconButtonStyle}
                  onClick={() => startEditScheduleItem(item)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  style={iconButtonStyle}
                  onClick={() => deleteScheduleItem(item.id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 