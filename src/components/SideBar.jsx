import React from "react";
import "../styles/SideBar.css";
import TrendingCard from "./TrendingCard";

const SideBar = () => {

  return (
    <div className="sidebar mt-4">
      <span className="sidebar-heading">Trending</span>
      <TrendingCard />
    </div>
  );
};

export default SideBar;
