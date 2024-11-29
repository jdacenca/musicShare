import { useNavigate } from "react-router-dom";
import defaultuser from "../assets/images/defaultuser.png";
import { React, useSelector, useState, useEffect } from "../CommonImports";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import {
  Home,
  Search,
  Plus,
  Clock,
  MessageCircle,
  Music,
  Users,
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import "../styles/Userpage.css";

const UserPage = () => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  // User details from localStorage with default values
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [postCount, setPostCount] = useState(12);
  const [followersCount, setFollowersCount] = useState(345);
  const [followingCount, setFollowingCount] = useState(200);

  // Friends and Playlists
  const [friends, setFriends] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // Dropdown states
  const [showAllPlaylists, setShowAllPlaylists] = useState(false);

  // Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsername, setEditUsername] = useState("");
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editProfilePic, setEditProfilePic] = useState("");

  useEffect(() => {
    // Load user details from localStorage on component mount
    setUsername(localStorage.getItem("username") || "username");
    setDisplayName(localStorage.getItem("displayName") || "User Name");
    setBio(localStorage.getItem("bio") || "This is a short bio about the user.");
    setProfilePic(
      localStorage.getItem("profilePic") || defaultuser
    );
  }, []);

  // Handle file input for profile picture
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset profile picture to default
  const handleRemoveProfilePic = () => {
    setEditProfilePic(defaultuser);
    setProfilePic(defaultuser); 
  };

  // Modal actions
  const handleEditClick = () => {
    setEditUsername(username);
    setEditDisplayName(displayName);
    setEditBio(bio);
    setEditProfilePic(profilePic);
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    setUsername(editUsername);
    setDisplayName(editDisplayName);
    setBio(editBio);
    setProfilePic(editProfilePic); // Ensure the profile picture is updated in main content

    // Save to localStorage
    localStorage.setItem("username", editUsername);
    localStorage.setItem("displayName", editDisplayName);
    localStorage.setItem("bio", editBio);
    localStorage.setItem("profilePic", editProfilePic); // Save the updated profile picture

    setShowEditModal(false);
  };

  return (
    <div
      id="app-container-id"
      className={`app-container ${isDarkMode ? "dark-mode" : ""}`}
    >
      <Header />
      <div className="row g-0">
        {/* Sidebar */}
        <div className="d-none d-md-block p-4 pe-0 col-md-2">
          <NavBar />

          {/* Playlist Dropdown */}
          <div
            className="playlist-toggle"
            onClick={() => setShowAllPlaylists(!showAllPlaylists)}
          >
            <div className="playlist-header">
              <User className="icon" />
              <span>Playlists</span>
            </div>
            {showAllPlaylists ? (
              <ChevronUp className="toggle-icon" />
            ) : (
              <ChevronDown className="toggle-icon" />
            )}
          </div>
          {showAllPlaylists && (
            <div className="playlist-list">
              {playlists.map((playlist, index) => (
                <div key={index} className="playlist-item">
                  <span>{playlist}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-10">
          <div className="main-content">
            {/* Profile Section */}
            <div className="profile-section">
              <div className="profile-header">
                <img
                  src={profilePic}
                  alt="User Profile"
                  className="profile-pic"
                />
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
                  <button
                    className="userpage-button edit-profile-btn"
                    onClick={handleEditClick}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Share Post Section */}
            <div className="posts-container">
              <h3>Share Your Post</h3>
              <p>When you share posts, they will appear on your profile.</p>
              <button className="userpage-button share-photo-btn">
                Share Post
              </button>
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
                        onChange={handleProfilePicChange} // Update the profile picture from the file input
                      />
                      <button
                        className="remove-btn"
                        onClick={handleRemoveProfilePic} // Reset to default profile picture
                      >
                        Remove Profile
                      </button>
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
                      <button
                        className="cancel-btn"
                        onClick={() => setShowEditModal(false)}
                      >
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
      </div>
    </div>
  );
};

export default UserPage;