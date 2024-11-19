import React, { useState } from "react";
import { Bell } from "react-feather"; // Import Bell icon
import "../styles/Notification.css";

function Notification({ isDarkMode }) {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notification data
  const notifications = [
    {
      id: 1,
      user: "Priya Gunalan",
      message: "Shared a music from walk the moon. Click here to listen.",
      time: "59 seconds ago",
    },
    {
      id: 2,
      user: "Christopher",
      message: 'Commented on your post: "Awesome! Thanks for sharing!"',
      time: "1 hour ago",
    },
    {
      id: 3,
      user: "Jeanne Damasco",
      message: "Shared a music from DNCE. Click here to listen.",
      time: "1 day ago",
    },
    {
      id: 4,
      user: "Lingyan Cui",
      message: "Liked your post.",
      time: "1 week ago",
    },
  ];
  // Toggle visibility of notifications
  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  return (
    <div className="notification-container">
      {/* Bell Icon */}
      <div className="icon-container" onClick={toggleNotifications}>
        <Bell size={24} className="header-icon" />
        <span className="notification-count">{notifications.length}</span>
      </div>

      {/* Notification Dropdown */}
      {showNotifications && (
        <div className={`notification-dropdown ${isDarkMode ? "dark-mode" : ""}`}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <strong>{notification.user}</strong>: {notification.message} <span className="notification-time">{notification.time}</span>
              </div>
            ))
          ) : (
            <div className="notification-empty">No new notifications</div>
          )}
        </div>
      )}
    </div>
  );
}


export default Notification;
