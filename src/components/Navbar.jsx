import React, { useEffect, useState } from "react";
import {
  Clock,
  Home,
  MessageCircle,
  Plus,
  Search,
  User,
  Users,
} from "react-feather";
import { useSelector } from "react-redux";
import "../styles/NavBar.css";
import PostPopup from "./PostPopup";
import SearchPopup from "./SearchPopup";

const NavBar = () => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  const [showFriends, setShowFriends] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  useEffect(() => {
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };

    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const toggleFriends = () => {
    setShowFriends(!showFriends);
  };

  return (
    <div className={`left-nav-bar ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Navigation Items */}
      <div className="nav-item">
        <Home className="nav-icon" />
        <span className="nav-label">Home</span>
      </div>

      <div className="nav-item" onClick={openSearch}>
        <Search className="nav-icon" />
        <span className="nav-label">Search</span>
      </div>

      <div className="nav-item" onClick={() => setPopupVisible(true)}>
        <Plus className="nav-icon" />
        <span className="nav-label">Create</span>
      </div>
      {isPopupVisible && (
        <PostPopup onClose={() => setPopupVisible(false)} />
      )}
      <div className="nav-item">
        <Clock className="nav-icon" />
        <span className="nav-label">History</span>
      </div>

      <div className="nav-item">
        <MessageCircle className="nav-icon" />
        <span className="nav-label">Messages</span>
      </div>

      {/* Expandable Friends Section */}
      <div className="nav-item" onClick={toggleFriends}>
        <Users className="nav-icon" />
        <span className="nav-label">Friends</span>
      </div>

      {showFriends && (
        <div className="sub-menu">
          <div className="sub-item">
            <User className="sub-icon" />
            <span>Lingyan Cui</span>
          </div>
          <div className="sub-item">
            <User className="sub-icon" />
            <span>Kayal Jenifer Christopher</span>
          </div>
          <div className="sub-item">
            <User className="sub-icon" />
            <span>Jeanne Damasco</span>
          </div>
        </div>
      )}

      {/* Search Popup */}
      <SearchPopup isOpen={isSearchOpen} closePopup={closeSearch} />
    </div>
  );
};

export default NavBar;
