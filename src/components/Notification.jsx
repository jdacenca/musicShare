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
  const userId = useSelector((state) => state.beatSnapApp.userId); // Adjust this path based on your Redux state
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
          `http://localhost:8777/api/notifications?userId=${userId}&viewed=false`
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

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };
  

  const markAsViewed = async (id) => {
    try {
      await fetch("http://localhost:8777/api/notifications/view", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: [id] }),
      });

      // Remove the notification from the UI after marking as viewed
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

  // Toggle visibility of notifications
  const toggleNotifications = () => {
    setShowNotifications((prevState) => !prevState);
  };

  const handleRemove = (id) => {
    const newArray = notifications.filter((item) => item.id !== id);
    setNotifications(newArray);
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
        <div
          ref={popupRef}
          className={`notification-dropdown ${isDarkMode ? "dark-mode" : ""}`}
        >
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id} className="notification-item mb-2">
                <div className="d-flex flex-row">
                  <NameCard
                    user={{
                      userImage: notification?.avatar,
                      username: notification?.name,
                      time: notification?.time,
                      profilePic: notification?.profilePic
                    }}
                  />
                  <div className="ms-auto">
                    {" "}
                    <button
                      className="close-button"
                      onClick={() => handleRemove(notification.id)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <span>{notification.message}</span>
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
