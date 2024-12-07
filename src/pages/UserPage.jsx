import {
  apiUrl,
} from "../CommonImports";
import { useNavigate } from "react-router-dom";
import defaultuser from "../assets/images/defaultuser.png";
import { React, useSelector, useState, useEffect, useDispatch } from "../CommonImports";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import {
  User,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import LiveCard from "../components/LiveCard";

import "../styles/Userpage.css";
import { setCurrentUser } from "../redux/slice";

const UserPage = () => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const dispatch = useDispatch();

  // User details from localStorage with default values
  const [userId, setUserId] = useState("");
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
    setUserId(currentUser.userId);
    setUsername(currentUser.username);
    setDisplayName(currentUser.fullname);
    setBio(currentUser.status);
    setProfilePic(currentUser.profilePic);
  }, []);

  // Handle file input for profile picture
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    
    console.log(file)
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfilePic(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      formData.append('userId', currentUser.userId);

      try {
        const response = await fetch(apiUrl + "/user/uploadpic", {
          headers: {
            //'Content-Type': 'multipart/form-data',
            'Access-Control-Allow-Origin': '*'
          },
          method: "POST",
          body: formData
        });

        const data = await response.json();
        dispatch(setCurrentUser({...currentUser, profilePic : data.image + '?t=' + Date.now()}))
        setProfilePic(data.image);
      }
      catch (err) {
        console.log("Error:");
        console.log(err);
      }
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

  const handleSaveChanges = async () => {

    console.log(userId)
    const response = await fetch(apiUrl + "/user/update", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(
        {
          "userId": userId,
          "name": editDisplayName, 
          "username": editUsername, 
          "status": editBio, 
          "profilePicURL": profilePic
        }
      )
    });
    //const data = await response.json();

    if (response.status == 200) {
      alert('User Updated');
      setUsername(editUsername);
      setDisplayName(editDisplayName);
      setBio(editBio);
      setProfilePic(editProfilePic); // Ensure the profile picture is updated in main content

      setUsername(editUsername);
      setDisplayName(editDisplayName);
      setBio(editBio);

      setShowEditModal(false);
    } else {
      alert('User update failed!...');
      console.log("Failed to Update")
    }

    
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

            <LiveCard/>

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
                        name='image'
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