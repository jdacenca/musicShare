import React from "react";
import { useSelector } from "react-redux";
import "../styles/TrendingCard.css";

const TrendingCard = () => {
  // Using useSelector to retrieve trendingMusic and isDarkMode state from the Redux store
  const trendingMusic = useSelector((state) => state.beatSnapApp.trendingMusic);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  return (
    // Dynamic className for dark mode support
    <div className={`trending-post-container ${isDarkMode ? "dark-mode" : ""}`}>

      {/* Map through the first 10 items of the trendingMusic tracks array */}
      {trendingMusic.tracks?.items?.slice(0, 10).map((item, index) => (
        <div
          key={index}
          className="trending-post card shadow-xss rounded-xxl border-0 mt-4 me-4"
        >
          <div className="trending-post-header d-flex flex-row">
            <div className="user-info flex-grow-1">
              <div className="">
                <h4 className="user-name">{item.track?.name}</h4>
                <p className="user-role">{item.track?.artists[0]?.name}</p>
              </div>
            </div>
            <div className="ms-auto ps-4 align-self-start">
              {/* <button
                className={`btn btn-secondary ${isDarkMode ? "dark-mode" : ""}`}
              >
                Follow
              </button> */}

              {/* Displaying the rank of the track */}
              <p className="ms-auto">#{index + 1}</p>
            </div>
          </div>

          {/* Spotify embed iframe for playing the track */}
          <div className="trending-post-body">
            <iframe
              src={`https://open.spotify.com/embed/track/${item.track?.id}`}
              height="240px"
              allow="encrypted-media"
              allowFullScreen
              title="Spotify player"
            ></iframe>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrendingCard;
