import {
  React,
  useState,
  useSelector,
  useRef,
  useEffect,
} from "../CommonImports";
import { Search, X } from "react-feather";
import "../styles/SearchPopup.css";

const SearchPopup = ({ isOpen, closePopup }) => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  const [searchQuery, setSearchQuery] = useState("");
  const suggestions = ["Imagine", "Imagine Dragons", "Imagine Scenarios"];
  const profiles = [
    { name: "imaginedragons", followers: "8.9M Following" },
    { name: "imaginescenarios", followers: "1M Following" },
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
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
            <div key={index} className="suggestion-item">
              <Search size={16} />
              <span>{suggestion}</span>
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
