import React from "react";
import { useSelector } from "react-redux";
import "../styles/TrendingCard.css";

const TrendingCard = () => {
  const trendingMusic = useSelector((state) => state.beatSnapApp.trendingMusic);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  return (
    <div className={`trending-post-container ${isDarkMode ? "dark-mode" : ""}`}>
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
              <p className="ms-auto">#{index + 1}</p>
            </div>
          </div>

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
