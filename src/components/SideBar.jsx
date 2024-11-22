import React from 'react';
import TrendingCard from './TrendingCard';
import TopCreators from './TopCreators';
import "../styles/SideBar.css";

const SideBar = ({ isDarkMode }) => {
  return (
    <div className="sidebar mt-4">
      <span className="sidebar-heading">Trending</span>
      <TrendingCard isDarkMode={isDarkMode} />
      {/* <span className="sidebar-heading mt-4">Top Creators</span>
      <TopCreators isDarkMode={isDarkMode}/> */}
    </div>
  );
};

export default SideBar;
