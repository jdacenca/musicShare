import React from "react";
import { User, Moon } from "react-feather"; // Import icons
import Notification from "./Notification"; // Import the Notification component
import "../styles/Header.css";
import logo from "../assets/images/logo.svg";
import user1 from "../assets/images/user1.jpg";

function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <div>
      <header
        className={`header d-flex flex-row ${isDarkMode ? "dark-mode" : ""}`}
      >
        {/* Brand Name */}
        <div className="col-3">
          <div className="logo-container">
            <img src={logo} alt="BeatSnap" className="header-logo" />
          </div>
        </div>

        {/* User Controls */}
        <div className="col-3 p-4 d-flex justify-content-end align-items-center">
          {/* Notification Component */}
          <Notification isDarkMode={isDarkMode} />

          {/* Dark Mode Toggle */}
          <div className="icon-container mx-3" onClick={toggleDarkMode}>
            <Moon size={24} className="header-icon" />
          </div>

          {/* User Profile Icon */}
          <div className="icon-container">
            <img
              src={user1}
              alt="User"
              className="user-avatar"
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
