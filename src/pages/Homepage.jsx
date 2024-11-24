import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header";
import MusicFeed from "../components/MusicFeed";
import NavBar from "../components/Navbar";
import SideBar from "../components/SideBar";

import {
  setCurrentUser,
  setTrendingMusic,
  setRecommendations,
} from "../redux/slice";
import "../styles/Homepage.css";

const Homepage = () => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentUser("priya_gounalan")); // TODO use data from auth
  }, [dispatch]);

  useEffect(() => {
    async function fetchSpotifyData() {
      //TODO - remove localhost. 
      await fetch("http://localhost:8777/spotify/connect", {
        method: "POST",
      });
      const response = await fetch("http://localhost:8777/spotify/trending");
      const data = await response.json();
      dispatch(setTrendingMusic(data));

      const recommendations = await fetch(
        "http://localhost:8777/spotify/recommendations?genre=rock"
      );
      const recommendationsData = await recommendations.json();
      dispatch(setRecommendations(recommendationsData));
    }
    fetchSpotifyData();
  }, [dispatch]);

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <Header />
      <div className="row g-0">
        {/* NavBar (Left Sidebar) */}
        <div className="d-none d-md-block p-4 pe-0 col-md-2 navbar-container">
          <NavBar />
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
