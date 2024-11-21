import React from "react";
import "../styles/TrendingCard.css";
import trending1 from "../assets/images/trending1.jpg";
import trending2 from "../assets/images/trending2.jpg";
import { Share2 } from "react-feather";

const trendingData = [
  {
    title: "Memories",
    artist: "Maroon 5",
    image: trending1, // Replace with actual image URL
    rank: "#1",
  },
  {
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: trending2, // Replace with actual image URL
    rank: "#2",
  },
];

const TrendingCard = () => {
  return (
    <div className="trending-post-container">
      {trendingData.map((item, index) => (
        <div
          key={index}
          className="trending-post card shadow-xss rounded-xxl border-0"
        >
          <div className="trending-post-header">
            <img src="./images/user3.jpg" alt="User" className="trending-post-user-avatar" />
            <p>Anonymous</p>
            <button className="trending-post-share-button">
              Follow
            </button>
          </div>
          <div className="trending-post-body">
            <img src={item.image} alt={item.title} className="trending-post-image" />
          </div>
          <div className="trending-post-footer"></div>
        </div>
      ))}
    </div>
  );
};

export default TrendingCard;
