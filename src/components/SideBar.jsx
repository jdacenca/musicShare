import React from "react";
import "../styles/SideBar.css";
import TrendingCard from "./TrendingCard";
import LiveCard from "./LiveCard";

const SideBar = () => {

  return (
    <div className="sidebar mt-4">
      <LiveCard/>
      <span className="sidebar-heading">Trending</span>
      <TrendingCard />
    </div>
  );
};

export default SideBar;
