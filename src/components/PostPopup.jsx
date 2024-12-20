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
import { setPosts } from "../redux/slice";

// PostPopup component - for creating, updating, and deleting posts
const PostPopup = ({
  type = "NEW",
  onClose,
  post,
  onDelete,
  postInitContent = "",
}) => {
  // Redux state selectors
  const posts = useSelector((state) => state.beatSnapApp.posts);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const [query, setQuery] = useState("");
  const [youtubeData, setYoutubeData] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  // Local state
  const popupRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const dispatch = useDispatch();

  // Handles actions based on the type of the popup (new, update, delete)
  const handleAction = () => {
    switch (type) {
      case "NEW":
        if (postContent) {
          createPost(); // Create a new post if there's content
        }
        onClose(); // Close the popup
        break;
      case "UPDATE":
        if (postContent) {
          updatePost(); // Update an existing post if there's content
        }
        onClose(); // Close the popup
        break;
      case "DELETE":
        if (post.canApiDelete) {
          deletePost(); // Delete the post if it can be deleted
        }
        onDelete(); // Callback to handle post-deletion outside of this component
        break;
      default:
        onClose(); // Close the popup
        break;
    }
  };

  // Function to create a new post
  const createPost = async () => {
    //api
    try {
      const resp = await fetch(apiUrl + "/post/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.userId,
          message: postContent,
          musicUrl: musicUrl,
        }),
      });

      const data = await resp.json();
      // New post object structure
      let post = {
        id: data.id,
        username: currentUser.fullname,
        userId: currentUser.userId,
        title: "",
        time: "Now",
        profilePic: currentUser.profilePic,
        description: postContent,
        likes: 0,
        comments: [],
        videoUrl: musicUrl,
        canApiDelete: true,
      };
      dispatch(setPosts([post, ...posts]));
    } catch {}
  };

  // Function to update an existing post
  const updatePost = async () => {
    const resp = await fetch(apiUrl + "/post/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
        userId: currentUser.userId,
        message: postContent,
        musicUrl: musicUrl,
      }),
    });

    dispatch(
      setPosts(
        posts.map((item) => {
          if (item.id === post.id) {
            return { ...item, description: postContent };
          } else {
            return item;
          }
        })
      )
    );
  };

  // Function to delete a post
  const deletePost = async () => {
    const resp = await fetch(apiUrl + "/post", {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
      }),
    });
  };

  // Function to handle clicks outside the popup to close it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Function to search for music on YouTube based on the query
  const searchYoutube = async (v) => {
    const youtubeSearch = await fetch(apiUrl + "/youtube/music/search?q=" + v);
    const youtubeSearchData = await youtubeSearch.json();
    setYoutubeData(youtubeSearchData.items);
    setShowSearch(true);
  };

  // useEffect hook for handling initialization and cleanup
  useEffect(() => {
    let initContent = type === "NEW" ? postInitContent : post.description;
    setPostContent(initContent);

    // Event listener to handle clicks outside the popup
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handlers for input changes
  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleSearchInputChange = (e) => {
    let v = e.target.value;
    setQuery(v);
    if (v) {
      searchYoutube(v); // Search for music if input is not empty
    }
  };

  const handleMusicUrlInputChange = (e) => {
    let v = e.target.value;
    if (v) {
      setMusicUrl(v); // Set the music URL
      setShowSearch(false); // Hide search results
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container" ref={popupRef}>
        {/* Header Section */}
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
          {/* Name Card Section */}

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
                time: "Now",
              }}
              isCurrentUser="true"
            />
          </div>
        )}
        {/* Textarea and Music URL Input */}
        <div>
          <textarea
            disabled={type === "DELETE"}
            placeholder="What's on your mind today?"
            className={`post-input w-100 ${isDarkMode ? "dark-mode" : ""}`}
            value={postContent}
            onChange={handleInputChange}
          />
          {musicUrl && (
            <iframe
              width="100%"
              height="200"
              src={musicUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>
        {/* Music Search and URL Input for NEW posts */}
        {type === "NEW" && (
          <div>
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
              {showSearch && youtubeData && youtubeData.length > 0 && (
                <div className="search-results">
                  {youtubeData.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id + index}
                      className="search-item d-flex flex-column mb-3 ps-4"
                      onClick={() => {
                        setShowSearch(false);
                        setMusicUrl(
                          "https://www.youtube.com/embed/" + item.id?.videoId
                        );
                      }}
                    >
                      <span>{item.snippet?.title}</span>
                      <span>
                        <a
                          href={
                            "https://www.youtube.com/watch?v=" +
                            item.id?.videoId
                          }
                        >
                          {"https://www.youtube.com/watch?v=" +
                            item.id?.videoId}
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <textarea
              placeholder="Paste music url here"
              className={`post-input w-100 ${isDarkMode ? "dark-mode" : ""}`}
              value={musicUrl}
              onChange={handleMusicUrlInputChange}
            />
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
                src={post.spotifyUrl}
                width="100%"
                height="360px"
                allow="encrypted-media"
                allowFullScreen
                title="Spotify player"
              ></iframe>
            ) : (
              <></>
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
