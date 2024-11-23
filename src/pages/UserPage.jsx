import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();
  
  // Use state hooks to manage user data
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [followingCount, setFollowingCount] = useState(0); // Track following count
  const [followersCount, setFollowersCount] = useState(0); // Track followers count
  const [isFollowing, setIsFollowing] = useState(false); // Track follow/unfollow status

  // Retrieve user data from localStorage when the component mounts
  useEffect(() => {
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
    setProfilePic(storedProfilePic || '/path-to-profile-pic'); // fallback to a default profile picture
    setFollowingCount(parseInt(storedFollowingCount) || 0);
    setFollowersCount(parseInt(storedFollowersCount) || 0);
    setIsFollowing(storedIsFollowing);
  }, []);

  // Handle profile picture change
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePic(base64String); // store the base64 in the state
        localStorage.setItem('profilePic', base64String); // save the base64 to localStorage
      };
      reader.readAsDataURL(file); // Convert to base64
    }
  };

  // Handle profile edit submission
  const handleSaveChanges = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('displayName', displayName);
    localStorage.setItem('bio', bio);
    localStorage.setItem('profilePic', profilePic); // Store base64 in localStorage
    localStorage.setItem('followingCount', followingCount);
    localStorage.setItem('followersCount', followersCount);
    localStorage.setItem('isFollowing', isFollowing.toString()); // Store follow status
    setShowEditModal(false); // Close the edit modal
  };

  // Handle Follow/Unfollow button click
  const handleFollowClick = () => {
    if (isFollowing) {
      setFollowersCount(followersCount - 1); // Decrease followers count when unfollowing
      setFollowingCount(followingCount - 1); // Decrease following count when unfollowing
    } else {
      setFollowersCount(followersCount + 1); // Increase followers count when following
      setFollowingCount(followingCount + 1); // Increase following count when following
    }
    setIsFollowing(!isFollowing); // Toggle follow/unfollow status
  };

  return (
    <div>
      <Header />
      <div className="user-page-container">
        {/* Profile Card */}
        <div className="left-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <img 
                src={profilePic} 
                alt="Profile" 
                className="profile-pic" 
              />
              <h2 className="username">{displayName}</h2> {/* Display name in bold */}
              <p className="user-handle">@{username}</p> {/* Username in small text */}
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

            <button 
              className="edit-profile-btn"
              onClick={() => setShowEditModal(true)}
            >
              Edit Profile
            </button>

            {/* Follow/Unfollow Button */}
            <button 
              className={`follow-btn ${isFollowing ? 'following' : ''}`} 
              onClick={handleFollowClick}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
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
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleProfilePicChange} 
                  />
                </div>
                <div className="form-group">
                  <label>Display Name</label>
                  <input 
                    type="text" 
                    placeholder="Update display name" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input 
                    type="text" 
                    placeholder="Update username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
                <div className="form-group">
                  <label>Bio</label>
                  <textarea 
                    placeholder="Update bio" 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                  />
                </div>
                <div className="button-group">
                  <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
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
