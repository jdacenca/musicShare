import React from "react";
import { User, Moon } from "react-feather"; // Import icons
import Notification from "./Notification"; // Import the Notification component
import "../styles/Header.css";

function Header({ isDarkMode, toggleDarkMode }) {
  return (
    <div>
      <header className={`header d-flex flex-row ${isDarkMode ? "dark-mode" : ""}`}>
        <div className="col-3 p-4">
          <h2>BeatSnap</h2>
        </div>
        <div className="col-6 p-4 align-self-center">
          <input type="text" className="w-100" placeholder="Search music..." />
        </div>
        <div className="col-3 p-4 d-flex justify-content-end align-items-center">
          {/* Notification Component */}
          <Notification isDarkMode={isDarkMode} />

          {/* Dark mode toggle (Moon icon) */}
          <div className="icon-container mx-3" onClick={toggleDarkMode}>
            <Moon size={24} className="header-icon" />
          </div>

          {/* User profile icon */}
          <div className="icon-container">
            <User size={24} className="header-icon" />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
