import {
  useState,
  useSelector,
  useRef,
  useEffect,
  useDispatch,
} from "../CommonImports";
import "../styles/PostPopup.css";
import { Search } from "react-feather";

const PostPopup = ({ type = "NEW", onClose, post }) => {
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const [query, setQuery] = useState("");
  const [youtubeData, setYoutubeData] = useState([]);

  const popupRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  const searchYoutube = async (v) => {
    //TODO - remove localhost.
    const youtubeSearch = await fetch(
      "http://localhost:8777/youtube/music/search?q=" + v
    );
    const youtubeSearchData = await youtubeSearch.json();
    console.log("youtubeSearchData", youtubeSearchData);
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
      console.log("Post created:", postContent); // Replace with API or post logic
      setPostContent(""); // Clear the input field
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container pt-0" ref={popupRef}>
        <div className="d-flex flex-row align-items-center border-bottom border-secondary mb-4">
          <div className="mx-auto">
            <h5>{type === "NEW" ? "Create new post" : "Update post"}</h5>
          </div>
          <div className="ml-auto">
            <button className="close-button pt-0" onClick={onClose}>
              &times;
            </button>
          </div>
        </div>

        <div className="user-info">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="user-avatar"
          />
          <div className="user-details">
            <p className="user-name">{currentUser?.fullname}</p>
            <p className="user-status">{currentUser?.status}</p>
          </div>
        </div>
        <div>
          <textarea
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
                  <div className="search-item d-flex flex-column mb-3 ps-4" >
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

        {type === "UPDATE" && (
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

        <div>
          <button className="btn btn-primary w-100 text-nowrap">
            {type === "NEW" ? "Post" : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
