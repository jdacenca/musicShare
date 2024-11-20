import React from 'react';
import TrendingCard from './TrendingCard';
import TopCreators from './TopCreators';
import "../styles/SideBar.css";

const SideBar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-heading">Trending</h2>
      <TrendingCard />
      <h2 className="sidebar-heading">Top Creators</h2>
      <TopCreators />
    </div>
  );
};

export default SideBar;
