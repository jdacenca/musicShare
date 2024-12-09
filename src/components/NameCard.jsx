import React from "react";
import "../styles/NameCard.css";
import { useSelector } from "../CommonImports";

const NameCard = ({ user, isCurrentUser = false, showName = true }) => {
  // Retrieving the current user's details from the Redux store
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  // Determine the title and profile picture based on whether it's the current user
  let title = isCurrentUser ? currentUser.status : user?.title;
  let profilePic = isCurrentUser ? currentUser.profilePic : user?.profilePic;

  return (
    <div className="user-info">
      {/* Display the user's profile picture */}
      <img src={profilePic} alt="User" className="user-avatar" />
      {/* Conditionally render the user's name and role if showName is true */}
      {showName && (
        <div>
          <h4 className="user-name">
            {/* Display the name based on whether it's the current user */}
            {isCurrentUser ? currentUser.fullname : user?.username}
          </h4>
          <p className="user-role">
            {/* Display the title and time if available */}
            {title ? title + ". " + user?.time : user?.time}
          </p>
        </div>
      )}
    </div>
  );
};

export default NameCard;
