import React from "react";
import { useSelector } from "react-redux";
import trending1 from "../assets/images/trending1.jpg";
import trending2 from "../assets/images/trending2.jpg";
import "../styles/TrendingCard.css";

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

const TrendingCard = () => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  return (
    <div className={`trending-post-container ${isDarkMode ? "dark-mode" : ""}`}>
      {trendingData.map((item, index) => (
        <div
          key={index}
          className="trending-post card shadow-xss rounded-xxl border-0 mt-4 me-4"
        >
          <div className="trending-post-header d-flex flex-row">
            <div className="user-info flex-grow-1">
              <img
                src="https://via.placeholder.com/40" // Replace with user profile image URL
                alt="User"
                className="user-avatar"
              />
              <div>
                <h4 className="user-name">{item.title}</h4>
                <p className="user-role">{item.artist}</p>
              </div>
            </div>
            <div className="ms-auto ps-4 align-self-start">
              <button
                className={`btn btn-secondary ${isDarkMode ? "dark-mode" : ""}`}
              >
                Follow
              </button>
            </div>
          </div>

          <div className="trending-post-body">
            <img
              src={item.image}
              alt={item.title}
              className="trending-post-image"
            />
          </div>
          <p className="ms-auto">{item.rank}</p>
        </div>
      ))}
    </div>
  );
};

export default TrendingCard;
