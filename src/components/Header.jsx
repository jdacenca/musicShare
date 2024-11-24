import React from "react";
import { Moon } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/images/logo.svg";
import user1 from "../assets/images/defaultuser.png";
import { useNavigate } from 'react-router-dom';
import { toggleDarkMode } from "../redux/slice";
import "../styles/Header.css";
import Notification from "./Notification";

function Header() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const profilePic = localStorage.getItem('profilePic') || user1;

  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

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
        <div className="col-3 d-flex justify-content-end align-items-center">
          {/* Notification Component */}
          <Notification />

          {/* Dark Mode Toggle */}
          <div className="icon-container mx-3" onClick={toggleDarkModeHandler}>
            <Moon size={24} className="header-icon" />
          </div>

          {/* User Profile Icon */}
          <div className="icon-container" onClick={() => navigate('/userpage')}>
            <img src={profilePic} alt="User" className="user-avatar" />
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header;
