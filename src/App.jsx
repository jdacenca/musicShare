import Navbar from "./components/Navbar";
import MusicFeed from "./components/MusicFeed";
import Header from "./components/Header";
import Trending from "./components/Trending";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.css";

import "./App.css";

function App() {
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
          <div className="col-2 navbar-container">
            <Navbar />
          </div>

          {/* Music Feed (Center Content) */}
          <div className="col-7 music-feed-container">
            <MusicFeed isDarkMode={isDarkMode} />
          </div>

          {/* Trending Section (Right Sidebar) */}
          <div className="col-3 trending-container">
            <Trending isDarkMode={isDarkMode} />
          </div>
        </div>
    </div>
  );
}

export default App;
