import React from "react";
import { useSelector } from "react-redux";
import "../styles/LiveCard.css";
import { Headphones } from "react-feather";
import NameCard from "./NameCard";

// LiveCard functional component
const LiveCard = () => {
  // Accessing the liveMusic data from Redux store
  const liveData = useSelector((state) => state.beatSnapApp.liveData);
  // Accessing the dark mode state from Redux store
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  // Accessing the current user information from Redux store
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  if(!liveData || liveData.state !== 'playing'){
    return <></>;
  }

  return (
    // Main container for the LiveCard with conditional styling based on dark mode
    <div
      className={`live-card-container pb-4 ${isDarkMode ? "dark-mode" : ""}`}
    >
      {/* Section heading */}
      <span className="sidebar-heading">Currently Playing</span>

      {/* Card container for displaying live music */}
      <div className="live-card card shadow-xss rounded-xxl border-0 mt-4 me-4">
        {/* Card Header */}
        <div className="live-card-header d-flex flex-row">
          {/* User information section */}
          <div className="user-info flex-grow-1">
            <NameCard
              user={{
                time: "Now",
              }}
              isCurrentUser="true"
            />
          </div>
          {/* Headphones icon aligned to the right */}
          <div className="ms-auto ps-4 align-self-start">
            <Headphones />
          </div>
        </div>

        {/* Card Body */}
        <div className="live-card-body">
          {/* Spotify embed player for the currently playing track */}
          {liveData.post.videoUrl ? (
            <iframe
              height="100px"
              src={liveData.post.videoUrl + "?enablejsapi=1"}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : liveData.post.spotifyUrl ? (
            <iframe
              src={`${liveData.post.spotifyUrl}`}
              height="100px"
              allow="encrypted-media"
              allowFullScreen
              title="Spotify player"
            ></iframe>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
