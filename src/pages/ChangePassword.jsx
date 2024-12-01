import {
  React,
  useState,
  useEffect,
  apiUrl,
} from "../CommonImports";
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ChangePassword.css';

const ChangePassword = () => {
// check the token first
  const {token} = useParams();
  const [id, setId] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate(); // For navigation

  //Call back end to check if the Url is Valid
  useEffect(() => {
    const checkTokenValidation = async () => {
      const response = await fetch(apiUrl + "/auth/resetpassword/" + token, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "GET",
      });
      const data = await response.json();
      console.log(data)
      setId(data.id);

      if (response.status == 200) {
        alert('Token validated!');
      } else {
        alert('Token is expired!...');
      }
    };

    checkTokenValidation();
  }, []);

  

  const togglePasswordVisibility = (type) => {
    if (type === 'current') setShowCurrentPassword(!showCurrentPassword);
    if (type === 'new') setShowNewPassword(!showNewPassword);
    if (type === 'confirm') setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    const response = await fetch(apiUrl + "/auth/change-password", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"id": id, "newPassword": newPassword})
    });
    const data = await response.json();

    if (response.status == 200) {
      alert('Password changed successfully');
      navigate('/login'); // Redirect to login or another page after password change
    } else {
      alert('Failed to change password!...');
    }
    
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
