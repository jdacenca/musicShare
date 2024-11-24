import React from "react";
import TrendingCard from "./TrendingCard";
import "../styles/SideBar.css";

const SideBar = () => {
  return (
    <div className="sidebar mt-4">
      <span className="sidebar-heading">Trending</span>
      <TrendingCard />
    </div>
  );
};

export default SideBar;
