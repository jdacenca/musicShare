import React from "react";
import { User, Moon } from "react-feather"; // Import icons
import Notification from "./Notification"; // Import the Notification component
import "../styles/Header.css";

function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <div>
      <header
        className={`header d-flex flex-row ${isDarkMode ? "dark-mode" : ""}`}
      >
        {/* Brand Name */}
        <div className="col-3 p-4">
          <h2>BeatSnap</h2>
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
            <User size={24} className="header-icon" />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
