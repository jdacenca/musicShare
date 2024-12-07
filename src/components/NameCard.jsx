import React from "react";
import "../styles/NameCard.css";
import { useSelector } from "../CommonImports";

const NameCard = ({ user, isCurrentUser = false, showName = true }) => {
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  let title = isCurrentUser ? currentUser.status : user?.title;
  let profilePic = isCurrentUser ? currentUser.profilePic : user?.profilePic;
  return (
    <div className="user-info">
      <img src={profilePic} alt="User" className="user-avatar" />
      {showName && (
        <div>
          <h4 className="user-name">
            {isCurrentUser ? currentUser.fullname : user?.username}
          </h4>
          <p className="user-role">
            {title ? title + ". " + user?.time : user?.time}
          </p>
        </div>
      )}
    </div>
  );
};

export default NameCard;
