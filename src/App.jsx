import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";

import MusicFeed from "./components/MusicFeed";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import NavBar from "./components/Navbar";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggles Dark Mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle("dark-mode", newDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="row g-0"> {/* Removes Bootstrap grid gap */}
        {/* NavBar (Left Sidebar) */}
        <div className="d-none d-md-block p-4 col-md-3 navbar-container">
          <NavBar isDarkMode={isDarkMode} />
        </div>

        {/* Music Feed (Center Content) */}
        <div className="col-12 col-md-6 music-feed-container">
          <MusicFeed isDarkMode={isDarkMode} />
        </div>

        {/* SideBar (Right Sidebar - Trending Section) */}
        <div className="d-none d-md-block p-4 col-md-3 trending-container">
          <SideBar isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
}

export default App;
