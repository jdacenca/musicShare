import Navbar from "../components/NavBar";
import MusicFeed from "../components/MusicFeed";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import "./Homepage.css";

const Homepage = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
    };

    return (
        <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
        {/* Header */}
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

            <div className="row g-0"> {/* Removes Bootstrap grid gap */}
            {/* Navbar (Left Sidebar) */}
            <div className="d-none d-md-block p-4 col-md-3 navbar-container">
                <Navbar isDarkMode={isDarkMode}/>
            </div>

            {/* Music Feed (Center Content) */}
            <div className="col-12 col-md-6 music-feed-container">
                <MusicFeed isDarkMode={isDarkMode} />
            </div>

            {/* Trending Section (Right Sidebar) */}
            <div className="d-none d-md-block p-4 col-md-3 trending-container">
                <SideBar isDarkMode={isDarkMode} />
            </div>
            </div>
        </div>
    );
}

export default Homepage;