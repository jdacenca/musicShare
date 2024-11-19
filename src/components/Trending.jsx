import React from "react";
import "../styles/Trending.css";


function Trending({ isDarkMode }) {
  // Example trending items
  const trendingItems = [
    { id: 1, title: "Song 1", artist: "Artist A" },
    { id: 2, title: "Song 2", artist: "Artist B" },
    { id: 3, title: "Song 3", artist: "Artist C" },
  ];

  return (
    <div className={`trending ${isDarkMode ? "dark-mode" : ""}`}>
      <h3>Trending</h3>
      <ul className="trending-list">
        {trendingItems.map((item) => (
          <li key={item.id} className="trending-item">
            <strong>{item.title}</strong> - {item.artist}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trending;
