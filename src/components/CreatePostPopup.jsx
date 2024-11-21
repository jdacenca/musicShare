import React, { useState } from "react";
import "../styles/CreatePostPopup.css";

const CreatePostPopup = ({ onClose }) => {
  const [query, setQuery] = useState("");

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Create new Post</h2>
        <div className="user-info">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="user-avatar"
          />
          <div className="user-details">
            <p className="user-name">Kelvin Li</p>
            <p className="user-status">Music Buff . Now</p>
          </div>
        </div>
        <textarea
          placeholder="What's on your mind today?"
          className="post-input"
        />
        <div className="search-section">
          <input
            type="text"
            placeholder="Search for music..."
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="search-results">
            <p>Wellerman by Nathan Evans</p>
            <a href="https://www.youtube.com/watch?v=p-7GNoDJ5c">
              https://www.youtube.com/watch?v=p-7GNoDJ5c
            </a>
            <p>Wellerman by Nathan Evans</p>
            <a href="https://open.spotify.com/album/1AK6peN1DwvYRXN19cgWoP">
              https://open.spotify.com/album/1AK6peN1DwvYRXN19cgWoP
            </a>
            <p className="see-more">See more...</p>
          </div>
        </div>
        <button className="post-button">Post</button>
      </div>
    </div>
  );
};

export default CreatePostPopup;
