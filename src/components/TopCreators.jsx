import React from 'react';
import { User } from 'react-feather';
import "../styles/SideBar.css";

const creatorsData = [
  { name: 'User 1', icon: <User /> },
  { name: 'User 2', icon: <User /> },
  { name: 'User 3', icon: <User /> },
];

const TopCreators = () => {
  return (
    <div className="top-creators">
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
