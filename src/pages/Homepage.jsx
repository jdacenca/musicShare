import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import MusicFeed from "../components/MusicFeed";
import Navbar from "../components/NavBar";
import SideBar from "../components/SideBar";

import { setCurrentUser } from "../redux/slice";
import "../styles/Homepage.css";

const Homepage = () => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentUser("priya_gounalan")); // TODO use data from auth
  }, [dispatch]);

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Header */}
      <Header />

      <div className="row g-0">
        {" "}
        {/* Removes Bootstrap grid gap */}
        {/* Navbar (Left Sidebar) */}
        <div className="d-none d-md-block p-4 pe-0 col-md-2 navbar-container">
          <Navbar />
        </div>
        {/* Music Feed (Center Content) */}
        <div className="col-12 col-md-7 music-feed-container">
          <MusicFeed />
        </div>
        {/* Trending Section (Right Sidebar) */}
        <div className="d-none d-md-block col-md-3 trending-container">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
