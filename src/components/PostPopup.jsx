import {
  useState,
  useSelector,
  useRef,
  useEffect,
  useDispatch,
  apiUrl,
} from "../CommonImports";
import "../styles/PostPopup.css";
import { Search, X } from "react-feather";
import NameCard from "./NameCard";

const PostPopup = ({ type = "NEW", onClose, post, onDelete }) => {
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const [query, setQuery] = useState("");
  const [youtubeData, setYoutubeData] = useState([]);

  const popupRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const dispatch = useDispatch();

  const handleAction = () => {
    switch (type) {
      case "NEW":
        //Validate
        //Save data - API
        onClose();
        break;
      case "UPDATE":
        //Validate
        //Save data - API
        onClose();
        break;
      case "DELETE":
        //Validate
        //Save data - API
        onDelete();
        break;
      default:
        onClose();
        break;
    }
  };

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  const searchYoutube = async (v) => {
    const youtubeSearch = await fetch(apiUrl + "/youtube/music/search?q=" + v);
    const youtubeSearchData = await youtubeSearch.json();
    setYoutubeData(youtubeSearchData.items);
  };

  useEffect(() => {
    let postInitContent = type === "NEW" ? "" : post.description;
    setPostContent(postInitContent);

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleSearchInputChange = (e) => {
    let v = e.target.value;
    setQuery(v);
    if (v) {
      searchYoutube(v);
    }
  };

  const handlePost = () => {
    if (postContent.trim()) {
      setPostContent(""); // Clear the input field
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        <div className="d-flex flex-row align-items-center border-bottom border-secondary mb-4 pt-2 pb-2">
          <div className="mx-auto">
            <h5>
              {type === "NEW"
                ? "Create new post"
                : type === "DELETE"
                ? "Are you sure you want to delete this post?"
                : "Update post"}
            </h5>
          </div>
          {type !== "DELETE" && (
            <div className="ml-auto">
              <button className="close-button" onClick={onClose}>
                <X />
              </button>
            </div>
          )}
        </div>
        {type !== "DELETE" && (
          <div>
            <NameCard
              user={{
                username: currentUser?.fullname,
                title: currentUser?.status,
                time: "Now",
              }}
            />
          </div>
        )}
        <div>
          <textarea
            disabled={type === "DELETE"}
            placeholder="What's on your mind today?"
            className={`post-input w-100 ${isDarkMode ? "dark-mode" : ""}`}
            value={postContent}
            onChange={handleInputChange}
          />
        </div>
        {type === "NEW" && (
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for music..."
                className="search-input"
                value={query}
                onChange={(e) => handleSearchInputChange(e)}
              />
              <Search className="search-icon" />
            </div>
            {youtubeData && youtubeData.length > 0 && (
              <div className="search-results">
                {youtubeData.slice(0, 3).map((item, index) => (
                  <div className="search-item d-flex flex-column mb-3 ps-4">
                    <span>{item.snippet?.title}</span>
                    <span>
                      <a
                        href={
                          "https://www.youtube.com/watch?v=" + item.id?.videoId
                        }
                      >
                        {"https://www.youtube.com/watch?v=" + item.id?.videoId}
                      </a>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {(type === "UPDATE" || type === "DELETE") && (
          <div>
            {post.videoUrl ? (
              <iframe
                width="100%"
                height="200"
                src={post.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : post.spotifyUrl ? (
              <iframe
                src={`https://open.spotify.com/embed/album/${post.spotifyUrl}`}
                width="100%"
                height="360px"
                allow="encrypted-media"
                allowFullScreen
                title="Spotify player"
              ></iframe>
            ) : (
              <img
                src={post.musicImage}
                alt="Music Cover"
                className="music-cover"
              />
            )}
          </div>
        )}
        <div className="pt-4" onClick={handleAction}>
          <button
            className={`btn w-100 text-nowrap ${
              type === "DELETE" ? "btn-danger" : "btn-primary"
            }`}
          >
            {type === "NEW" ? "Post" : type === "DELETE" ? "Delete" : "Update"}
          </button>
        </div>
        {type === "DELETE" && (
          <div onClick={onClose} className="pt-2">
            <button className="btn w-100 text-nowrap btn-primary">
              Cancel
            </button>
          </div>
        )}{" "}
      </div>
    </div>
  );
};

export default PostPopup;
