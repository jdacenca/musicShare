import { apiUrl } from "../CommonImports";
import { useNavigate } from "react-router-dom";
import defaultuser from "../assets/images/defaultuser.png";
import {
  React,
  useSelector,
  useState,
  useEffect,
  useDispatch,
} from "../CommonImports";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import LiveCard from "../components/LiveCard";
import { PlusCircle } from "react-feather";
import PostPopup from "../components/PostPopup";
import MusicPost from "../components/MusicPost";
import { useSearchParams } from "react-router-dom";
import moment from "moment";
import {setFollowing, setUnfollowing} from "../redux/slice";

import "../styles/Userpage.css";
import { setCurrentUser } from "../redux/slice";
import useScrollToTop from '../helper/useScrollToTop';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// UserPage component
const UserPage = () => {
  const scroll = useScrollToTop();

  // Hooks to manage state and navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Retrieving data from Redux store
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const following = useSelector((state) => state.beatSnapApp.following);

  // Get query parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();
  const otherUser = searchParams.get("username");

  // Initial user details, determined by whether the page is for the current user or another user
  const [userDetails, setUserDetails] = useState(
    otherUser
      ? {
          username: otherUser,
          user: {},
          posts: [],
          followersCount: null,
          followingCount: null,
        }
      : {
          username: currentUser.username,
          user: currentUser,
          posts: [],
          followersCount: null,
          followingCount: null,
        }
  );

  // State for tracking if the user is followed
  const [followed, setFollowed] = useState(false);

  // Check if the logged-in user is already following the other user
  let isFollowing = false;
  following.forEach((x) => {
    if (x.username === otherUser ) isFollowing = true;
  });

  // Prevent follow/unfollow for self
  if(currentUser.username === otherUser) {
    isFollowing = true;
  }

  // User details from localStorage with default values
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

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

  // States for creating a post and displaying live cards
  const [isCreatePostPopupVisible, setCreatePostPopupVisible] = useState(false);
  const [showLiveCard, setShowLiveCard] = useState(false);

  // States for tracking follower and following counts
  const [followingNo, setFollowingNo] = useState(0);
  const [followersNo, setFollowersNo] = useState(0);

  useEffect(() => {
    // Load user details from localStorage on component mount
    setUserId(currentUser.userId);
    setUsername(currentUser.username);
    setDisplayName(currentUser.fullname);
    setBio(currentUser.status);
    setProfilePic(currentUser.profilePic);
  }, []);

  // Fetch user details from the API when the otherUser changes
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const res = await fetch(
          apiUrl +
            "/user/get?username=" +
            (otherUser ? otherUser : currentUser.username)
        );
        let data = await res.json();

        let formattedData = {
          user: data.user,
          posts: data.posts.map((x) => {
            let timeAgo = moment(x.created_timestamp).fromNow();
            //timeAgo = timeAgo.replace('in','');
            let item = {
              id: x.id,
              userId: x.user_id,
              username: x.name,
              profilePic: x.profile_pic_url,
              title: x.status,
              time: timeAgo,
              description: x.message,
              likes: x.no_of_likes,
              comments: [],
              canApiDelete: currentUser.userId == x.user_id ? true : false,
            };

            if (x.music_url && x.music_url.indexOf("spotify") !== -1) {
              item.spotifyUrl = x.music_url;
            } else {
              item.videoUrl = x.music_url;
            }
            return item;
          }),
          followersCount: data.followersCount,
          followingCount: data.followingCount,
        };
        setUserDetails(formattedData);
        setFollowingNo(data.followingCount);
        setFollowersNo(data.followersCount);
      } catch (e) {
        console.log(e);
      }
    }

    fetchUserDetails();
  }, [otherUser]);

  // Handle file input for profile picture
  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfilePic(reader.result);
      };
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      formData.append("userId", currentUser.userId);

      try {
        const response = await fetch(apiUrl + "/user/uploadpic", {
          headers: {
            //'Content-Type': 'multipart/form-data',
            "Access-Control-Allow-Origin": "*",
          },
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        dispatch(
          setCurrentUser({
            ...currentUser,
            profilePic: data.image + "?t=" + Date.now(),
          })
        );
        setProfilePic(data.image);
      } catch (err) {
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

  // Navigate to settings page
  const handleSettingsClick = () => {
    navigate("/settings");
  };

  // Navigate to messaging page
  const handleMessageClick = () => {
    navigate("/message");
  };

  // Follow user functionality
  const handleFollowClick = () => {
    setFollowed(true);
    followUser(userDetails.user.userId);
  };

  // Unfollow user functionality
  const handleUnfollowClick = () => {
    setFollowed(false);
    unFollowUser(userDetails.user.userId);
  };

  // API call to unfollow a user
  const unFollowUser = async (id) => {
    const resp = await fetch(apiUrl + "/user/unfollow", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        following_id: id,
        user_id: currentUser.userId,
      }),
    });

    setFollowersNo(followersNo-1);
    dispatch(setUnfollowing(id));
  };

  // API call to follow a user
  const followUser = async (id) => {
    const resp = await fetch(apiUrl + "/user/follow", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        following_id: id,
        user_id: currentUser.userId,
      }),
    });

    dispatch(
      setFollowing([
        {
          following_id: id,
          user_id: currentUser.userId,
          username: userDetails.username,
          name: userDetails.user.fullname,
          profile_pic_url: userDetails.user.profilePic
        },
        ...following,
      ])
    );
    setFollowersNo(followersNo+1);
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    const response = await fetch(apiUrl + "/user/update", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        userId: userId,
        name: editDisplayName,
        username: editUsername,
        status: editBio,
        profilePicURL: profilePic,
      }),
    });
    //const data = await response.json();

    if (response.status == 200) {
      toast("User Updated");
      setUsername(editUsername);
      setDisplayName(editDisplayName);
      setBio(editBio);
      setProfilePic(editProfilePic); // Ensure the profile picture is updated in main content

      dispatch(
        setCurrentUser({
          ...currentUser,
          username: editUsername,
          fullname: editDisplayName,
          status: editBio,
          profilePic: editProfilePic + "?t=" + Date.now(),
        })
      );

      setShowEditModal(false);
    } else {
      console.log("Failed to Update");
    }
  };

  return (
    <div
      id="app-container-id"
      className={`app-container ${isDarkMode ? "dark-mode" : ""}`}
    >
      <Header />

      <div ref={scroll} className="row g-0">
        {/* Sidebar */}
        <div className="d-none d-md-block p-4 pe-0 col-md-2 sidebar">
          <NavBar />
        </div>

        {/* Main Content */}
        <div className="col-12 col-md-10 main-content">
          {/* Profile Section */}

          <div
            className={`userpage-header-container p-4 ${
              isDarkMode ? "dark-mode" : ""
            }`}
          >
            <div className="d-flex flex-row gap-4">
              <div className="userpage-user-info">
                <div className="d-flex flex-column gap-4">
                  <img
                    src={userDetails.user.profilePic}
                    alt="User"
                    className="userpage-user-avatar align-self-center"
                  />
                  {!otherUser && (
                    <div
                      className="align-self-center"
                      onClick={() => setCreatePostPopupVisible(true)}
                    >
                      <PlusCircle size={40} />
                    </div>
                  )}
                </div>

                <div className="ps-4 d-flex flex-column gap-5">
                  <div className="d-flex flex-row gap-5">
                    <div>
                      <h4 className="userpage-user-name text-nowrap">
                        {userDetails.user.fullname}
                      </h4>
                      <p className="userpage-user-role pt-2">
                        @{userDetails.user.username}
                      </p>
                    </div>

                    <div className="d-flex flex-row gap-5">
                      {otherUser && (otherUser !== currentUser.username) ? (
                        <>
                          <button
                            className="btn btn-primary align-self-center text-nowrap"
                            onClick={handleMessageClick}
                          >
                            Message
                          </button>
                          {(isFollowing || followed ) ? (
                            <button className="btn btn-secondary align-self-center text-nowrap"
                            onClick={handleUnfollowClick}
                            >
                              Following
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary align-self-center text-nowrap"
                              onClick={handleFollowClick}
                            >
                              Follow
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary align-self-center text-nowrap"
                            onClick={handleEditClick}
                          >
                            Edit Profile
                          </button>
                          <button
                            className="btn btn-primary align-self-center text-nowrap"
                            onClick={handleSettingsClick}
                          >
                            Settings
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex flex-column gap-5">
                    <div className="d-flex flex-row gap-5">
                      <div>
                        <strong>
                          {userDetails.posts?.length
                            ? userDetails.posts.length
                            : 0}
                        </strong>{" "}
                        Posts
                      </div>
                      <div>
                        <strong>{followersNo}</strong> Followers
                      </div>
                      <div>
                        <strong>{followingNo}</strong> Following
                      </div>
                    </div>
                    <div>
                      <p className="bio">{bio}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isCreatePostPopupVisible && (
            <PostPopup onClose={() => setCreatePostPopupVisible(false)} />
          )}

          {showLiveCard && <LiveCard />}

          {/* Share Post Section */}
          <div
            className={`userpage-posts-container ${
              isDarkMode ? "dark-mode" : ""
            }`}
          >
            {userDetails.posts && userDetails.posts.length > 0 ? (
              <div className="d-flex flex-row flex-wrap align-items-start justify-content-center">
                {userDetails.posts.slice(0, 9).map((post, index) => (
                  <div className="me-4 pb-4" key={post.id}>
                    <MusicPost
                      post={post}
                      onDelete={() => onPostDelete(post.id)}
                      cardType="small"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p>When you share posts, they will appear on your profile.</p>
            )}
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
                      name="image"
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
  );
};

export default UserPage;
