import {
  apiUrl,
  React,
  useEffect,
  useState,
  useSelector,
  useDispatch,
  useNavigate,
} from "../CommonImports";
import {
  Clock,
  Home,
  MessageCircle,
  Plus,
  Search,
  User,
  Users,
} from "react-feather";
import "../styles/NavBar.css";
import PostPopup from "./PostPopup";
import SearchPopup from "./SearchPopup";
import { setFollowing } from "../redux/slice";

const NavBar = () => {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const following = useSelector((state) => state.beatSnapApp.following);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const dispatch = useDispatch();

  const [showFriends, setShowFriends] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navigate = useNavigate();

  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);

  useEffect(() => {
    async function fetchFollowing() {
      let followingList = [];
      try {
        const apiFollowing = await fetch(apiUrl + "/user/following", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.userId,
          }),
        });
        const apiFollowingData = await apiFollowing.json();

        console.log(apiFollowingData)
        apiFollowingData.forEach((x) => {
          followingList.push(x);
        });

        dispatch(setFollowing(followingList));
      }
      catch (err) {
        console.log("Error:");
        console.log(err);
      }
    }
    const handleShortcut = (e) => {
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    };

    fetchFollowing()
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  const toggleFriends = () => {
    setShowFriends(!showFriends);
  };

  return (
    <div className={`left-nav-bar ${isDarkMode ? "dark-mode" : ""}`}>
      {/* Navigation Items */}
      <div className="nav-item" onClick={() => navigate("/home")}>
        <Home className="nav-icon" />
        <span className="nav-label">Home</span>
      </div>

      <div className="nav-item" onClick={openSearch}>
        <Search className="nav-icon" />
        <span className="nav-label">Search</span>
      </div>

      <div className="nav-item" onClick={() => setPopupVisible(true)}>
        <Plus className="nav-icon" />
        <span className="nav-label">Create</span>
      </div>
      {isPopupVisible && <PostPopup onClose={() => setPopupVisible(false)} />}
      <div className="nav-item">
        <Clock className="nav-icon" />
        <span className="nav-label">History</span>
      </div>

      <div className="nav-item">
        <MessageCircle className="nav-icon" />
        <span className="nav-label">Messages</span>
      </div>

      {/* Expandable Friends Section */}
      <div className="nav-item" onClick={toggleFriends}>
        <Users className="nav-icon" />
        <span className="nav-label">Friends</span>
      </div>

      {showFriends && (
        <div className="sub-menu">
          {following.slice(0, 15).map((following, index) => (
            <div className="sub-item" key={index}>
            <img src={following.profile_pic_url} alt="User" className="user-avatar" />
            <span>{following.name}</span>
          </div>
          ))}
        </div>
      )}

      {/* Search Popup */}
      <SearchPopup isOpen={isSearchOpen} closePopup={closeSearch} />
    </div>
  );
};

export default NavBar;
