import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultUserImage from '../assets/images/defaultuser.png';
import {
  Clock,
  Home,
  MessageCircle,
  Plus,
  Search,
  User,
  Users,
} from "react-feather";

import '../styles/Userpage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Retrieve user details from localStorage or set default values
  const [username, setUsername] = useState(localStorage.getItem('username') || 'username');
  const [displayName, setDisplayName] = useState(localStorage.getItem('displayName') || 'User Name');
  const [bio, setBio] = useState(localStorage.getItem('bio') || 'This is a short bio about the user.');
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || defaultUserImage);
  const [postCount, setPostCount] = useState(12); // Keep static or store this too if needed
  const [followersCount, setFollowersCount] = useState(345); // Same as above
  const [followingCount, setFollowingCount] = useState(200); // Same as above

  // Friends and Playlists
  const [friends, setFriends] = useState(['Lingyan Cui', 'Jeanne Damasco', 'Haripriya', 'Friend 4', 'Friend 5']);
  const [playlists, setPlaylists] = useState(['Playlist1', 'Playlist 2', 'Playlist 3', 'Playlist 4', 'Playlist 5']);

  // State for toggling drop-downs
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showAllPlaylists, setShowAllPlaylists] = useState(false);

  // State for profile editing modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState(username);
  const [editDisplayName, setEditDisplayName] = useState(displayName);
  const [editBio, setEditBio] = useState(bio);
  const [editProfilePic, setEditProfilePic] = useState(profilePic);

  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  // Handle file input for profile picture
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfilePic(reader.result); // Update editProfilePic state only
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    setUsername(editUsername);
    setDisplayName(editDisplayName);
    setBio(editBio);
    setProfilePic(editProfilePic);

    // Save to localStorage
    localStorage.setItem('username', editUsername);
    localStorage.setItem('displayName', editDisplayName);
    localStorage.setItem('bio', editBio);
    localStorage.setItem('profilePic', editProfilePic);

    // Optionally save to backend here
    setShowEditModal(false);
  };

  return (
    <div className={isDarkMode ? 'dark-mode user-page' : 'light-mode user-page'}>
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Section 1: Navigation */}
        <div className="section-box">
          <a href="/" className="nav-link"><Home className="me-2" /> Home</a>
          <a href="/search" className="nav-link"><Search className="me-2" /> Search</a>
          <a href="/create" className="nav-link"><Plus className="me-2" /> Create</a>
          <a href="/history" className="nav-link"><Clock className="me-2" /> History</a>
          <a href="/messages" className="nav-link"><MessageCircle className="me-2" /> Messages</a>
        </div>

        {/* Section 2: Friends */}
        <div className="section-box">
          <h4 className="section-heading"><Users className="me-2" /> <strong>Friends</strong></h4>
          {friends.slice(0, showAllFriends ? friends.length : 3).map((friend, index) => (
            <p key={index}>{friend}</p>
          ))}
          <div className="dropdown" onClick={() => setShowAllFriends(!showAllFriends)}>
            <span>{showAllFriends ? '^ show less' : 'v show more'}</span>
          </div>
        </div>

        {/* Section 3: Playlists */}
        <div className="section-box">
          <h4 className="section-heading"><User className="me-2" /> <strong>Playlists</strong></h4>
          {playlists.slice(0, showAllPlaylists ? playlists.length : 3).map((playlist, index) => (
            <p key={index}>{playlist}</p>
          ))}
          <div className="dropdown" onClick={() => setShowAllPlaylists(!showAllPlaylists)}>
            <span>{showAllPlaylists ? '^ show less' : 'v show more'}</span>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="main-content">
        {/* Profile Section */}
        <div className="profile-section">
          <div className="profile-header">
            <img src={profilePic} alt="Profile" className="profile-pic" />
            <div className="profile-info">
              <h2>{displayName}</h2>
              <p className="username">@{username}</p>
              <div className="profile-stats">
                <div>
                  <strong>{postCount}</strong> Posts
                </div>
                <div>
                  <strong>{followersCount}</strong> Followers
                </div>
                <div>
                  <strong>{followingCount}</strong> Following
                </div>
              </div>
              <p className="bio">{bio}</p>
              <button className="edit-profile-btn" onClick={handleEditClick}>Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Share Post Section */}
        <div className="posts-container">
          <h3>Share Your Post</h3>
          <p>When you share post, they will appear on your profile.</p>
          <button className="share-photo-btn">Share Post</button>
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
