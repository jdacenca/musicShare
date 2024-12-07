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
import {io} from "socket.io-client"

/*export const notifications_mock = [
  {
    id: 1,
    name: "Kelvin Li",
    message: "Shared a music from walk the moon. Click here to listen.",
    time: "59 seconds ago",
    avatar: "https://via.placeholder.com/50", // Replace with avatar URL
  },
  {
    id: 2,
    name: "Christopher",
    message: `Commented on your post. "Awesome! Thanks for Sharing!"`,
    time: "1 hour ago",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    name: "Jeanne Damasco",
    message: "Shared a music from DNCE. Click here to listen.",
    time: "1 day ago",
    avatar: "https://via.placeholder.com/50",
  },
  {
    id: 4,
    name: "Lingyan Cui",
    message: "Liked your post.",
    time: "1 week ago",
    avatar: "https://via.placeholder.com/50",
  },
];
*/

function Notification() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const popupRef = useRef(null);
  const socketRef = useRef(null); 
  
  useEffect(() => {
    // Establish a Socket.IO connection
    socketRef.current = io("testing"); // Replace with your backend URL

    // Handle connection
    socketRef.current.on("connect", () => {
      console.log("Connected to Socket.IO server:", socketRef.current.id);

      // Fetch initial notifications
      socketRef.current.emit("fetch_notifications", "current-user-id"); // Replace with actual user ID
    });

    // Listen for notifications from the server
    socketRef.current.on("notifications", (data) => {
      console.log("Received notifications:", data);
      setNotifications(data); // Update the notifications state
    });

    // Listen for new post notifications
    socketRef.current.on("new_post_notification", (notification) => {
      console.log("New post notification received:", notification);
      setNotifications((prev) => [notification, ...prev]); // Add to existing notifications
    });

    // Handle disconnection
    socketRef.current.on("disconnect", (reason) => {
      console.log("Disconnected from server. Reason:", reason);
    });

    // Cleanup on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      toggleNotifications();
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
