import {
  React,
  useState,
  useSelector,
  useRef,
  useEffect,
} from "../CommonImports";
import { Bell, X } from "react-feather"; // Import Bell icon
import "../styles/Notification.css";
import NameCard from "./NameCard";



function Notification() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const userId = currentUser?.userId || localStorage.getItem("userId");
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      console.error("User ID is not defined. Please log in to view notifications.");
      return;
    }

    // Fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/notifications?userId=${userId}&viewed=false`
        );
        const data = await response.json();
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  // Mark notification as viewed
  const markAsViewed = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/view`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: [id] }),
      });

      // Remove the notification from the list after marking as viewed
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error("Error marking notification as viewed:", error);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };
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
        <div ref={popupRef} className="notification-dropdown">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.notification_id}
                className="notification-item mb-2"
              >
                <div className="d-flex flex-row">
                  <img
                    src={notification.user_avatar || "/default-avatar.png"} // Fallback for missing avatar
                    alt="User Avatar"
                    className="notification-avatar"
                  />
                  <div className="notification-content">
                    <span className="notification-title">
                      {notification.notification_title || "New Notification"}
                    </span>
                    <div className="notification-user-time">
                  <span className="notification-posted-by">
                    <b>Posted by:</b>
                  </span>
                 <span className="highlight-username">
                   {notification.user_name || "Unknown User"}
                  </span>
                  <span className="notification-time">
                   {notification.notification_time
                    ? new Date(notification.notification_time).toLocaleString()
                     : "Invalid Date"}
                  </span>
                  </div>
                    <p className="notification-message">
                      {notification.post_message || "No message available."}
                    </p>
                    {notification.music_url && (
                      <a
                        href={notification.music_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="notification-link"
                      >
                        Listen to the music
                      </a>
                    )}
                  </div>
                  <button
                    className="close-button ms-auto"
                    onClick={() => markAsViewed(notification.notification_id)}
                  >
                    <X size={16} />
                  </button>
                </div>
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