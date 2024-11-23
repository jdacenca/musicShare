import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/UserPage.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div>
      <Header />
      <div className="user-page-container">
        {/* Profile Card */}
        <div className="left-sidebar">
          <div className="profile-card">
            <div className="profile-header">
              <img src="/path-to-profile-pic" alt="Profile" className="profile-pic" />
              <h2 className="username">User Name</h2>
              <p className="user-handle">@username</p>
            </div>
            
            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-number">123</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">456</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">789</span>
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
                  <input type="file" accept="image/*" />
                </div>
                <div className="form-group">
                  <label>Username</label>
                  <input type="text" placeholder="Update username" />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" placeholder="New password" />
                </div>
                <div className="button-group">
                  <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button className="save-btn">Save Changes</button>
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