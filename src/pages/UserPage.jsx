import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import defaultUserImage from '../assets/images/defaultuser.png';
import '../styles/Userpage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // State for user data
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(defaultUserImage);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  // State for editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState('');
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProfilePic, setEditProfilePic] = useState('');
  const [previewProfilePic, setPreviewProfilePic] = useState('');

  useEffect(() => {
    // Retrieve dark mode preference
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);

    // Retrieve user data from localStorage
    const storedUsername = localStorage.getItem('username');
    const storedDisplayName = localStorage.getItem('displayName');
    const storedBio = localStorage.getItem('bio');
    const storedProfilePic = localStorage.getItem('profilePic');
    const storedFollowingCount = localStorage.getItem('followingCount');
    const storedFollowersCount = localStorage.getItem('followersCount');
    const storedIsFollowing = localStorage.getItem('isFollowing') === 'true';

    setUsername(storedUsername || 'username');
    setDisplayName(storedDisplayName || 'User Name');
    setBio(storedBio || 'This is a short bio about the user.');
    setProfilePic(storedProfilePic || defaultUserImage);
    setFollowingCount(parseInt(storedFollowingCount) || 0);
    setFollowersCount(parseInt(storedFollowersCount) || 0);
    setIsFollowing(storedIsFollowing);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const handleEditClick = () => {
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditProfilePic(profilePic);
    setPreviewProfilePic(profilePic); // Set initial preview
    setShowEditModal(true);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfilePic(reader.result);
        setPreviewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveProfilePic = () => {
    setPreviewProfilePic(defaultUserImage); 
    setEditProfilePic(defaultUserImage); 
    setIsProfilePicRemoved(true);
  };

  const handleSaveChanges = () => {
    setUsername(editUsername);
    setDisplayName(editDisplayName);
    setBio(editBio);
    setProfilePic(editProfilePic);

    localStorage.setItem('username', editUsername);
    localStorage.setItem('displayName', editDisplayName);
    localStorage.setItem('bio', editBio);
    localStorage.setItem('profilePic', editProfilePic);
    setShowEditModal(false);
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    // Reset edit states when canceling
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditProfilePic(profilePic);
    setPreviewProfilePic(profilePic); 
  };

  const handleFollowClick = () => {
    if (isFollowing) {
      setFollowersCount(followersCount - 1);
      setFollowingCount(followingCount - 1);
    } else {
      setFollowersCount(followersCount + 1);
      setFollowingCount(followingCount + 1);
    }
    setIsFollowing(!isFollowing);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="user-page-container">
        <div className="left-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-pic-container">
                <img src={profilePic} alt="Profile" className="profile-pic" />
              </div>
              <h2 className="username">{displayName}</h2>
              <p className="user-handle">@{username}</p>
              <p className="bio">{bio}</p>
            </div>
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{followingCount}</span>
                <span className="stat-label">Following</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{followersCount}</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
            <button className="edit-profile-btn" onClick={handleEditClick}>
              Edit Profile
            </button>
            <button
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollowClick}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
            <button className="logout-btn" onClick={() => navigate('/login')}>
              Log Out
            </button>
          </div>
        </div>
        <div className="posts-section">
          <h3>My Posts</h3>
          <div className="posts-grid">
            <p>No posts yet</p>
          </div>
        </div>
        {showEditModal && (
          <div className="modal-overlay">
            <div className={`modal-content ${isDarkMode ? 'dark-mode' : ''}`}>
              <h3>Edit Profile</h3>
              <div className="edit-form">
                <div className="form-group">
                  <label>Profile Picture</label>
                  <div className="profile-pic-container">
                    <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                    <button className="remove-pic-btn" onClick={handleRemoveProfilePic}>
                      Remove Profile
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>
                <div className="button-group">
                  <button className="cancel-btn" onClick={handleCancelEdit}>
                    Cancel
                  </button>
                  <button className="save-btn" onClick={handleSaveChanges}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
