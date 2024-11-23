import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();

  // Retrieve initial data from localStorage or set default values
  const storedUsername = localStorage.getItem('username') || 'User Name';
  const storedBio = localStorage.getItem('bio') || 'This is a short bio about the user.';
  const storedProfilePic = localStorage.getItem('profilePic') || '/path-to-profile-pic';
  const storedPosts = localStorage.getItem('posts') || 0;
  const storedFollowers = localStorage.getItem('followers') || 0;
  const storedFollowing = localStorage.getItem('following') || 0;

  const [showEditModal, setShowEditModal] = useState(false);

  // State to manage user info
  const [username, setUsername] = useState(storedUsername);
  const [bio, setBio] = useState(storedBio);
  const [profilePic, setProfilePic] = useState(storedProfilePic);
  const [posts, setPosts] = useState(storedPosts);
  const [followers, setFollowers] = useState(storedFollowers);
  const [following, setFollowing] = useState(storedFollowing);

  // Handle Bio change
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // Handle Username change
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file)); // For now, just a local preview
    }
  };

  // Handle saving changes
  const handleSaveChanges = () => {
    // Save changes to localStorage
    localStorage.setItem('username', username);
    localStorage.setItem('bio', bio);
    localStorage.setItem('profilePic', profilePic);
    localStorage.setItem('posts', posts);
    localStorage.setItem('followers', followers);
    localStorage.setItem('following', following);

    setShowEditModal(false); // Close modal after saving
  };

  // Ensure data is loaded from localStorage on first render
  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'User Name');
    setBio(localStorage.getItem('bio') || 'This is a short bio about the user.');
    setProfilePic(localStorage.getItem('profilePic') || '/path-to-profile-pic');
    setPosts(localStorage.getItem('posts') || 0);
    setFollowers(localStorage.getItem('followers') || 0);
    setFollowing(localStorage.getItem('following') || 0);
  }, []);

  return (
    <div>
      <Header />
      <div className="user-page-container">
        {/* Profile Card */}
        <div className="left-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <img src={profilePic} alt="Profile" className="profile-pic" />
              <h2 className="username">{username}</h2>
              <p className="user-handle">@{username}</p>
              {/* Bio Section */}
              <p className="user-bio">{bio}</p>
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">{posts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>

            <button 
              className="edit-profile-btn"
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>

            {/* Separate Logout Button */}
            <button 
              className="logout-btn"
              onClick={() => navigate('/login')}
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Posts Section */}
        <div className="posts-section">
          <h3>My Posts</h3>
          <div className="posts-grid">
            <p>No posts yet</p>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Profile</h3>
              <div className="edit-form">
                <div className="form-group">
                  <label>Profile Picture</label>
                  <input type="file" accept="image/*" onChange={handleProfilePicChange} />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    value={username} 
                    onChange={handleUsernameChange}
                    placeholder="Update username" 
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    value={bio} 
                    onChange={handleBioChange}
                    placeholder="Update your bio"
                  />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="New password" />
                </div>
                <div className="button-group">
                  <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
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
