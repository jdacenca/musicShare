import {
  apiUrl,
  React,
  useState,
  useSelector,
  useRef,
  useEffect,
  useDispatch,
} from "../CommonImports";
import { useNavigate } from "react-router-dom";
import { Bell, X } from "react-feather"; // Import Bell icon
import "../styles/Notification.css";
import NameCard from "./NameCard";
import { setNotifications } from "../redux/slice";
import moment from "moment";

function Notification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const notifications = useSelector((state) => state.beatSnapApp.notifications);

  const [showNotifications, setShowNotifications] = useState(false);
  const popupRef = useRef(null);
  const popupBtnRef = useRef(null);

  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          apiUrl +
            `/api/notifications?userId=${currentUser.userId}&viewed=false`
        );
        const data = await response.json();
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
    if (popupRef.current && !popupRef.current.contains(event.target)
        && popupBtnRef.current && !popupBtnRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  // Toggle visibility of notifications
  const toggleNotifications = () => {
    setShowNotifications((showNotifications) => !showNotifications);
  };

  const goToPost = (id) => {
    setShowNotifications(false);
    navigate("/post?id=" + id);
  };

  return (
    <div className="notification-container">
      <div ref={popupBtnRef} className="icon-container" onClick={toggleNotifications}>
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
                <div key={notification.notification_id} className="notification-item mb-2" onClick={() => {
                  markAsViewed(notification.notification_id);
                  goToPost(notification.post_id);
                }
                 
                }>
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
