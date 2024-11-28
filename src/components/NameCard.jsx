import React from "react";
import "../styles/NameCard.css";

const NameCard = ({ user }) => {
  return (
    <div className="user-info">
      <img
        src={user.userImage || "https://via.placeholder.com/50"}
        alt="User"
        className="user-avatar"
      />
      <div>
        <h4 className="user-name">{user.username || "Anonymous"}</h4>
        <p className="user-role">
          {user.title ? user.title + ". " + user.time : user.time}
        </p>
      </div>
    </div>
  );
};

export default NameCard;
