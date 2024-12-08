import {
  apiUrl,
  React,
  useState,
  useSelector,
  useRef,
  useEffect,
  useDispatch,
} from "../CommonImports";
import { Bell, X } from "react-feather"; // Import Bell icon
import "../styles/Notification.css";
import NameCard from "./NameCard";
import { setNotifications } from "../redux/slice";
import moment from "moment";

const sanitizeYouTubeLink = (url) => {
  try {
    const urlObj = new URL(url);

    // Check if it's a YouTube embed link
    if (
      urlObj.hostname === "www.youtube.com" &&
      urlObj.pathname.includes("/embed/")
    ) {
      const videoId = urlObj.pathname.split("/embed/")[1];
      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    // If not an embed link, return the original URL
    return url;
  } catch (error) {
    console.error("Invalid URL:", url);
    return url; // Return original URL if parsing fails
  }
};

function Notification() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const notifications = useSelector((state) => state.beatSnapApp.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          apiUrl +
            `/api/notifications?userId=${currentUser.userId}&viewed=false`
        );
        const data = await response.json();
        console.log("Fetched notifications:", data);
        dispatch(setNotifications(data));
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  // Mark notification as viewed
  const markAsViewed = async (id) => {
    try {
      await fetch(apiUrl + `/api/notifications/view`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: [id] }),
      });

      // Remove the notification from the list after marking as viewed
      dispatch(
        setNotifications(
          notifications.filter(
            (notification) => notification.notification_id !== id
          )
        )
      );
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
      <div className="icon-container" onClick={toggleNotifications}>
        <Bell size={24} className="header-icon" />
        <span className="notification-count">{notifications.length}</span>
      </div>

      {showNotifications && (
        <div
          ref={popupRef}
          className={`notification-dropdown ${isDarkMode ? "dark-mode" : ""}`}
        >
          {notifications.length > 0 ? (
            <>
              {notifications.slice(0, 4).map((notification) => (
                <div key={notification.id} className="notification-item mb-2">
                  <div className="d-flex flex-row">
                    <NameCard
                      user={{
                        username: notification?.name,
                        time: moment(notification?.notification_time).fromNow(),
                        profilePic: notification?.profile_pic_url,
                      }}
                    />
                    <div className="ms-auto">
                      {" "}
                      <button
                        className="close-button"
                        onClick={() =>
                          markAsViewed(notification.notification_id)
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span>{notification.post_message}</span>
                  </div>
                </div>
              ))}
              {notifications.length > 4 && (
                <div className="notification-empty">
                  {notifications.length - 4} more
                </div>
              )}
            </>
          ) : (
            <div className="notification-empty">No new notifications</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Notification;
