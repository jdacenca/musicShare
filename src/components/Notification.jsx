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

function Notification() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const notifications = useSelector((state) => state.beatSnapApp.notifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const popupRef = useRef(null);
  const dispatch = useDispatch();

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

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  const markAsViewed = async (id) => {
    try {
      await fetch(apiUrl + "/api/notifications/view", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notificationIds: [id] }),
      });

      // Remove the notification from the UI after marking as viewed
      dispatch(
        setNotifications(
          notifications.filter((notification) => notification.id !== id)
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
                        time: moment(notification?.created_at).fromNow(),
                        profilePic: notification?.profile_pic_url,
                      }}
                    />
                    <div className="ms-auto">
                      {" "}
                      <button
                        className="close-button"
                        onClick={() => markAsViewed(notification.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div>
                    <span>{notification.message}</span>
                  </div>
                </div>
              ))}
              {notifications.length > 4 && (
                <div className="notification-empty">{notifications.length - 4} more</div>
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
