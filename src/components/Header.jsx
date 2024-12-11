import React, { useEffect, useRef, useState } from "react";
import { Moon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import { toggleDarkMode } from "../redux/slice";
import "../styles/Header.css";
import Notification from "./Notification";
import { persistor } from "../redux/store";


// Header component
function Header() {

  // Redux state selectors
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  // Redux dispatch function
  const dispatch = useDispatch();

  // Navigation hook
  const navigate = useNavigate();

  // State to toggle the visibility of the profile menu
  const [showMenu, setShowMenu] = useState(false);

  // Function to toggle the menu visibility
  const toggleMenu = () => setShowMenu(!showMenu);

  // Ref to track the popup element for outside click handling
  const popupRef = useRef(null);
  const popupBtnRef = useRef(null);

  // Function to toggle dark mode
  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
    document.body.classList.toggle("dark-mode", !isDarkMode); // Apply the dark mode class to the body element
  };

  // Function to handle user actions (e.g., navigation, logout)
  const handleAction = (action) => {
    setShowMenu(false); // Close the menu
    switch (action) {
      case "userpage": // Navigate to the user's profile page
        navigate("/userpage");
        break;
      case "logout": // Clear persisted state and navigate to the login screen
        persistor.purge();
        navigate("/");
        break;
      case "settings":
        navigate("/settings"); // Navigate to the settings page
        break;
      default:
        break;
    }
  };

  // Closes the popup when clicking outside of it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)
      && popupBtnRef.current && !popupBtnRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  // Attach and detach the event listener
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.addEventListener("mousedown", handleClickOutside); // Add event listener for outside clicks
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup event listener on component unmount
    };
  }, []);

  return (
    <div>
      <header
        className={`header d-flex flex-row ${isDarkMode ? "dark-mode" : ""}`}
      >
        {/* Brand Name */}
        <div className="col-3" onClick={() => navigate("/home")}>
          <div className="logo-container">
            <img src={logo} alt="BeatSnap" className="header-logo" />
          </div>
        </div>

        {/* User Controls */}
        <div className="col-3 d-flex justify-content-end align-items-center">
          {/* Notification Component */}
          <Notification />

          {/* Dark Mode Toggle */}
          <div className="icon-container mx-4" onClick={toggleDarkModeHandler}>
            <Moon className="header-icon" /> 
          </div>

          {/* User Profile Icon */}
          <div ref={popupBtnRef} className="icon-container" onClick={toggleMenu}>
            <img
              src={currentUser?.profilePic}
              alt="User"
              className="user-avatar"
            />
          </div>
          {/* Profile Menu Popup */}
          {showMenu && (
            <div ref={popupRef} className="profile-menu-popup">
              <ul>
                <li onClick={() => handleAction("userpage")}>Profile</li>
                <li onClick={() => handleAction("settings")}>Settings</li>
                <li onClick={() => handleAction("logout")}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
