import React, { useState } from 'react';
import "../styles/NavBar.css";
import { Home, Search, Plus, Clock, MessageCircle, User, Users } from 'react-feather';

const NavBar = ({ isDarkMode }) => {
    const [showFriends, setShowFriends] = useState(false);

    const toggleFriends = () => {
        setShowFriends(!showFriends);
    };

    return (
        <div className={`left-nav-bar  ${isDarkMode ? "dark-mode" : ""}`}>

            <div className="nav-item">
                <Home className="nav-icon" />
                <span className="nav-label">Home</span>
            </div>
            <div className="nav-item">
                <Search className="nav-icon" />
                <span className="nav-label">
                    Search <span className="shortcut">ctrl + k</span>
                </span>
            </div>
            <div className="nav-item">
                <Plus className="nav-icon" />
                <span className="nav-label">Create</span>
            </div>
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
        </div>
    );
};

export default NavBar;
