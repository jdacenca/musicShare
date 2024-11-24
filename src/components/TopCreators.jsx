import React from "react";
import { User } from "react-feather";
import { useSelector } from "react-redux";
import "../styles/SideBar.css";

const creatorsData = [
  { name: "User 1", icon: <User /> },
  { name: "User 2", icon: <User /> },
  { name: "User 3", icon: <User /> },
];

const TopCreators = () => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  return (
    <div className={`top-creators ${isDarkMode ? "dark-mode" : ""}`}>
      {creatorsData.map((creator, index) => (
        <div key={index} className="creator-item">
          <div className="icon">{creator.icon}</div>
          <p className="creator-name">{creator.name}</p>
        </div>
      ))}
    </div>
  );
};

export default TopCreators;
