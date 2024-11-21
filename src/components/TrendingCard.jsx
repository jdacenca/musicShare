import React from "react";
import "../styles/TrendingCard.css";
import trending1 from "../assets/images/trending1.jpg";
import trending2 from "../assets/images/trending2.jpg";

const trendingData = [
  {
    title: "Memories",
    artist: "Maroon 5",
    image: trending1,
    rank: "#1",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: trending2,
    rank: "#2",
  },
];

const TrendingCard = ({ isDarkMode }) => {
  return (
    <div className={`trending-post-container ${isDarkMode ? "dark-mode" : ""}`}>
      {trendingData.map((item, index) => (
        <div
          key={index}
          className="trending-post card shadow-xss rounded-xxl border-0"
        >
          <div className="trending-post-header">
          <img
                src="https://via.placeholder.com/30"
                alt="icon3"
                className="trending-icon"
              />
            <div className="trending-post-title-container">
              <p className="trending-post-title">{item.title}</p>
              <p className="trending-post-artist">{item.artist}</p>
            </div>
            <button className="trending-post-follow-button">Follow</button>
          </div>
          <div className="trending-post-body">
            <img
              src={item.image}
              alt={item.title}
              className="trending-post-image"
            />
          </div>
          <div className="trending-post-footer">
            <div className="trending-footer-icons">
              <img
                src="https://via.placeholder.com/30"
                alt="icon1"
                className="trending-icon"
              />
              <img
                src="https://via.placeholder.com/30"
                alt="icon2"
                className="trending-icon"
              />
              <img
                src="https://via.placeholder.com/30"
                alt="icon3"
                className="trending-icon"
              />
            </div>
            <p className="trending-rank">{item.rank}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingCard;
