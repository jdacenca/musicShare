import React from "react";
import { useSelector } from "react-redux";
import "../styles/LiveCard.css";
import NameCard from "./NameCard";

const LiveCard = () => {
  const liveMusic = useSelector((state) => state.beatSnapApp.liveMusic);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  return (
    <div
      className={`live-card-container pb-4 ${isDarkMode ? "dark-mode" : ""}`}
    >
      <span className="sidebar-heading">Currently Playing</span>
      <div className="live-card card shadow-xss rounded-xxl border-0 mt-4 me-4">
        <div className="live-card-header d-flex flex-row">
          <div className="user-info flex-grow-1">
            <NameCard
              user={{
                username: currentUser?.fullname,
                title: currentUser?.status,
                time: "Now",
              }}
            />
          </div>
          <div className="ms-auto ps-4 align-self-start"></div>
        </div>

        <div className="live-card-body">
          <iframe
            src={`https://open.spotify.com/embed/album/29aSKB1qPEbN0Qf9OPSQpw`}
            height="100px"
            allow="encrypted-media"
            allowFullScreen
            title="Spotify player"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LiveCard;
