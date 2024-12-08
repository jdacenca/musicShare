import React, { useEffect, useRef, useState } from "react";
import { Moon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.svg";
import { toggleDarkMode } from "../redux/slice";
import "../styles/Header.css";
import Notification from "./Notification";
import { persistor } from "../redux/store";

function Header() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const toggleMenu = () => setShowMenu(!showMenu);
  const popupRef = useRef(null);

  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  const handleAction = (action) => {
    setShowMenu(false); // Close the menu
    switch (action) {
      case "userpage":
        navigate("/userpage");
        break;
      case "logout":
        persistor.purge();
        navigate("/");
        break;
      case "settings":
        navigate("/settings"); // 替换 alert
        break;
      default:
        break;
    }
  };

  // Closes the popup when clicking outside of it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  // Attach and detach the event listener
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          <div className="icon-container" onClick={toggleMenu}>
            <img
              src={currentUser?.profilePic}
              alt="User"
              className="user-avatar"
            />
          </div>
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
