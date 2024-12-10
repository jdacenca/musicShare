import React from "react";
import "../styles/SideBar.css";
import TrendingCard from "./TrendingCard";
import LiveCard from "./LiveCard";

// Right SideBar Component
const SideBar = () => {
  return (
    <div className="sidebar mt-4">
      {/* Rendering the LiveCard component, likely showing live content or updates */}
      <LiveCard />

      {/* Displaying a heading for the trending section */}
      <span className="sidebar-heading">Trending</span>

      {/* Rendering the TrendingCard component, which shows a list of trending items */}
      <TrendingCard />
    </div>
  );
};

export default SideBar;
