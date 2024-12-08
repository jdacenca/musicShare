import {
  React,
  useState,
  useSelector,
  useRef,
  useEffect,
  apiUrl
} from "../CommonImports";
import { Search, X } from "react-feather";
import "../styles/SearchPopup.css";
import { useNavigate } from "react-router-dom";

const SearchPopup = ({ isOpen, closePopup }) => {
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const sug = ["Imagine", "Imagine Dragons", "Imagine Scenarios"];
  const profiles = [
    { name: "imaginedragons", followers: "8.9M Following" },
    { name: "imaginescenarios", followers: "1M Following" },
  ];

  const handleSearchChange = async (e) => {
    setSuggestions([]); // Reset the value to empty
    setSearchQuery(e.target.value);

    let suggestions = []
    const userSearch = await fetch(apiUrl + "/search/user", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"keyword": searchQuery})
    });
    const data = await userSearch.json();

    data.forEach((u) => {
      suggestions.push({
        id: u.id,
        name: u.name,
        username: u.username,
        profilePic: u.profile_pic_url,
      });
    });

    setSuggestions(suggestions)
  };

  const popupRef = useRef(null);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      closePopup();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const goToUserPage = (username) => {
    closePopup();
    navigate("/userpage?username=" + username);
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
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="suggestion-item" onClick={() => {
              goToUserPage(suggestion.username)
            }}>
              <Search size={16} />
              <div className="sub-item" key={index}>
                <img src={suggestion.profilePic} alt="User" className="user-avatar" />
                <span>{suggestion.name}</span>
              </div>
            </div>
          ))}
          <div className="see-more">See more...</div>
          <div className="profile-suggestions">
            {profiles.map((profile, index) => (
              <div key={index} className="profile-item">
                <div className="profile-avatar" />
                <div>
                  <p className="profile-name">{profile.name}</p>
                  <p className="profile-followers">{profile.followers}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPopup;
