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
import user1 from "../assets/images/user1.jpg";
import { setPosts } from "../redux/slice";

const PostPopup = ({
  type = "NEW",
  onClose,
  post,
  onDelete,
  postInitContent = "",
}) => {
  const posts = useSelector((state) => state.beatSnapApp.posts);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const [query, setQuery] = useState("");
  const [youtubeData, setYoutubeData] = useState([]);

  const popupRef = useRef(null);
  const [postContent, setPostContent] = useState("");
  const [musicUrl, setMusicUrl] = useState("");
  const dispatch = useDispatch();

  const handleAction = () => {
    switch (type) {
      case "NEW":
        if (postContent) {
          createPost();
        }
        onClose();
        break;
      case "UPDATE":
        if (postContent) {
          updatePost();
        }
        onClose();
        break;
      case "DELETE":
        if (post.canApiDelete) {
          deletePost();
        }
        onDelete();
        break;
      default:
        onClose();
        break;
    }
  };

  const createPost = async () => {
    // dummy insert in ui
    let post = {
      id: crypto.randomUUID,
      username: currentUser.fullname,
      title: "",
      time: "Now",
      userImage: user1,
      description: postContent,
      likes: 0,
      comments: [],
      videoUrl: musicUrl,
    };

    const newArray = [post].concat(posts);
    dispatch(setPosts(newArray));

    //api
    try {
      const resp = await fetch(apiUrl + "/post/create", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentUser.id,
          message: postContent,
          musicUrl: musicUrl,
        }),
      });
      const data = await resp.json();
    } catch {}
  };

  const updatePost = async () => {
    const resp = await fetch(apiUrl + "/post/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: post.id,
        userId: currentUser.id,
        message: postContent,
        musicUrl: musicUrl,
      }),
    });
    const data = await resp.json();
  };

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
    const data = await resp.json();
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
    let initContent = type === "NEW" ? postInitContent : post.description;
    setPostContent(initContent);

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

  const handleMusicUrlInputChange = (e) => {
    let v = e.target.value;
    if (v) {
      setMusicUrl(v);
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
              {youtubeData && youtubeData.length > 0 && (
                <div className="search-results">
                  {youtubeData.slice(0, 3).map((item, index) => (
                    <div
                      key={item.id + index}
                      className="search-item d-flex flex-column mb-3 ps-4"
                      onClick={() =>
                        setMusicUrl(
                          "https://www.youtube.com/embed/" + item.id?.videoId
                        )
                      }
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
                src={`https://open.spotify.com/embed/album/${post.spotifyUrl}`}
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
