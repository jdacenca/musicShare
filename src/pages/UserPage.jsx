import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultUserImage from '../assets/images/defaultuser.png';
import '../styles/Userpage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User details
  const [username, setUsername] = useState('username');
  const [displayName, setDisplayName] = useState('User Name');
  const [bio, setBio] = useState('This is a short bio about the user.');
  const [profilePic, setProfilePic] = useState(defaultUserImage);
  const [postCount, setPostCount] = useState(12);
  const [followersCount, setFollowersCount] = useState(345);
  const [followingCount, setFollowingCount] = useState(200);

  // Friends and Playlists
  const [friends, setFriends] = useState(['Friend 1', 'Friend 2', 'Friend 3', 'Friend 4', 'Friend 5']);
  const [playlists, setPlaylists] = useState(['Playlist 1', 'Playlist 2', 'Playlist 3', 'Playlist 4', 'Playlist 5']);

  // State for toggling drop-downs
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [showAllPlaylists, setShowAllPlaylists] = useState(false);

  useEffect(() => {
    const darkModePreference = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePreference);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <div className={isDarkMode ? 'dark-mode user-page' : 'light-mode user-page'}>
      {/* Left Sidebar */}
      <div className="sidebar">
        {/* Section 1: Navigation */}
        <div className="section-box">
          <a href="/" className="nav-link">Home</a>
          <a href="/search" className="nav-link">Search</a>
          <a href="/create" className="nav-link">Create</a>
          <a href="/history" className="nav-link">History</a>
          <a href="/messages" className="nav-link">Messages</a>
        </div>

        {/* Section 2: Friends */}
        <div className="section-box">
          {friends.slice(0, showAllFriends ? friends.length : 3).map((friend, index) => (
            <p key={index}>{friend}</p>
          ))}
          <div className="dropdown" onClick={() => setShowAllFriends(!showAllFriends)}>
            <span>{showAllFriends ? '^ show less' : 'v show more'}</span>
          </div>
        </div>

        {/* Section 3: Playlists */}
        <div className="section-box">
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
              <button className="edit-profile-btn">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Share Post Section */}
        <div className="posts-container">
          <h3>Share Your Post</h3>
          <p>When you share post, they will appear on your profile.</p>
          <button className="share-photo-btn">Share Post</button>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
