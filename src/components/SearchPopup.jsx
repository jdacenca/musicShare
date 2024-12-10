import {
  React,
  useState,
  useSelector,
  useRef,
  useEffect,
  apiUrl,
} from "../CommonImports";
import { Search, X } from "react-feather";
import "../styles/SearchPopup.css";
import { useNavigate } from "react-router-dom";

const SearchPopup = ({ isOpen, closePopup }) => {
  const navigate = useNavigate();

  // Access the dark mode setting and current user details from the Redux store
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  // State variables for managing search query, suggestions, and profiles
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [profiles, setProfiles] = useState([]);

  /*const suggestions = ["Imagine", "Imagine Dragons", "Imagine Scenarios"];
  const profiles = [
    { name: "imaginedragons", followers: "8.9M Following" },
    { name: "imaginescenarios", followers: "1M Following" },
  ];*/

  // Handles the change event for the search input
  const handleSearchChange = async (e) => {
    setSuggestions([]); // Reset the value to empty
    setProfiles([]);
    let searchValue = e.target.value;
    setSearchQuery(e.target.value);

    let profiles = [];

    // Fetch user search results from the API
    const userSearch = await fetch(apiUrl + "/search/user", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        keyword: searchValue,
        currentUsername: currentUser.username,
      }),
    });
    const profileData = await userSearch.json();

    // Map the fetched data into the profiles array
    profileData.forEach((u) => {
      profiles.push({
        id: u.id,
        name: u.name,
        username: u.username,
        profilePic: u.profile_pic_url,
      });
    });

    let suggestions = [];
    // Fetch post search results from the API
    const postSearch = await fetch(apiUrl + "/search/post", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        keyword: searchValue,
        userId: currentUser.userId,
      }),
    });
    const postData = await postSearch.json();

    // Map the fetched data into the suggestions array
    postData.forEach((p) => {
      suggestions.push({
        id: p.post_id,
        name: p.name,
        username: p.username,
        profilePic: p.profile_pic_url,
        status: p.status,
        message:
          p.message.length > 20 ? p.message.slice(0, 22) + "..." : p.message,
      });
    });

    // Update state with fetched data
    setProfiles(profiles);
    setSuggestions(suggestions);
  };

  // Ref to track the popup element
  const popupRef = useRef(null);

  // Close the popup when clicking outside
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closePopup();
    }
  };

  // Add event listener for clicks outside the popup
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate to a user's page
  const goToUserPage = (username) => {
    closePopup();
    navigate("/userpage?username=" + username);
  };

  // Navigate to a post page
  const goToPost = (id) => {
    navigate("/post?id=" + id);
  };

  if (!isOpen) return null; // Don't render if closed

  return (
    <div
      className={`search-popup-container ${
        isDarkMode ? "dark-mode" : "light-mode"
      }`}
      ref={popupRef}
    >
      <div className="search-popup">
        {/* Search bar header */}
        <div className="search-header">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
          />
          <button className="close-button" onClick={closePopup}>
            <X size={20} />
          </button>
        </div>
        {/* Displaying user profile suggestions */}
        <div className="profile-suggestions">
          {profiles.map((profile, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                goToUserPage(profile.username);
              }}
            >
              <div className="sub-item" key={index}>
                <img
                  src={profile.profilePic}
                  alt="User"
                  className="user-avatar"
                />
                <span>{profile.name}</span>
                <span>{profile.followers}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Displaying post search suggestions */}
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                goToPost(suggestion.id);
              }}
            >
              <Search size={16} />
              <div className="sub-item" key={index}>
                <img
                  src={suggestion.profilePic}
                  alt="Post"
                  className="user-avatar"
                />
                <span>{suggestion.name}</span>
                <span>{suggestion.message}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
