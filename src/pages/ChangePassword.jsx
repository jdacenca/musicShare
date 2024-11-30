import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // For navigation

  const togglePasswordVisibility = (type) => {
    if (type === 'current') setShowCurrentPassword(!showCurrentPassword);
    if (type === 'new') setShowNewPassword(!showNewPassword);
    if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    alert('Password changed successfully');
    navigate('/home'); // Redirect to home or another page after password change
  };

  return (
    <div className="change-password-container">
      <div className="left-section">
        {/* Left Section - Background (optional) */}
      </div>

      <div className="right-section">
        <h2>Change Password</h2>
        <form onSubmit={handleSaveChanges}>
          {/* Current Password */}
          <div className="form-group">
            <div className="password-input">
            </div>
          </div>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
              <i
                className="toggle-password"
                onClick={() => togglePasswordVisibility('new')}
              >
                👁️
              </i>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <i
                className="toggle-password"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                👁️
              </i>
            </div>
          </div>

          {/* Save Changes Button */}
          <button type="submit" className="save-changes-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
