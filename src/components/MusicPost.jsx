import {
  React,
  useState,
  useRef,
  useEffect,
  useSelector,
} from "../CommonImports";
import { Heart, MessageCircle, MoreHorizontal, Share2, X } from "react-feather";
import "../styles/MusicPost.css";
import Comment from "./Comment";
import PostPopup from "./PostPopup";
import NameCard from "./NameCard";

function MusicPost({ post, onDelete }) {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  const [isLiked, setIsLiked] = useState(false); // Tracks whether the post is liked
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Tracks whether the menu is visible

  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const popupRef = useRef(null);

  const [isPostPopupVisible, setPostPopupVisible] = useState(false);
  const [isPostDelete, setPostDelete] = useState(false);

  const handleLikeToggle = () => {
    setLikes(isLiked ? likes - 1 : likes + 1); // Increment or decrement likes
    setIsLiked(!isLiked); // Toggle like state
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText) {
      setComments([
        ...comments,
        { username: "current_user", text: commentText },
      ]);
      setCommentText("");
    }
  };

  const toggleComments = () => setShowComments(!showComments);
  const toggleMenu = () => setShowMenu(!showMenu); // Toggles the 3-dots menu

  const handleAction = (action) => {
    setShowMenu(false); // Close the menu
    switch (action) {
      case "edit":
        setPostDelete(false);
        setPostPopupVisible(true);
        break;
      case "hide":
        onDelete();
        break;
      case "delete":
        setPostDelete(true);
        setPostPopupVisible(true);
        break;
      case "account-details":
        alert("Account details action triggered");
        break;
      default:
        break;
    }
  };

  // Closes the popup when clicking outside of it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  // Attach and detach the event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`music-post card shadow-xss rounded-xxl border-0 p-4 m-4 ${
        isDarkMode ? "dark-mode" : ""
      }`}
    >
      {/* Post Header */}
      <div className="post-header">
        <NameCard user={post} />
        <p></p>
        <div className="post-header-actions">
          <button className="post-menu-button" onClick={toggleMenu}>
            <MoreHorizontal />
          </button>
          {showMenu && (
            <div className="post-menu-popup" ref={popupRef}>
              <ul>
                {currentUser.username === post.username && (
                  <>
                    <li onClick={() => handleAction("edit")}>Edit</li>
                    <li onClick={() => handleAction("delete")}>Delete</li>
                  </>
                )}
                <li onClick={() => handleAction("account-details")}>
                  Account Details
                </li>
                <li onClick={() => handleAction("cancel")}>Cancel</li>
              </ul>
            </div>
          )}
          {isPostPopupVisible && (
            <PostPopup
              type={isPostDelete ? "DELETE" : "UPDATE"}
              onClose={() => setPostPopupVisible(false)}
              post={post}
              onDelete={() => {
                setPostPopupVisible(false);
                onDelete();
              }}
            />
          )}
          <button className="close-button" onClick={() => handleAction("hide")}>
            <X />
          </button>
        </div>
      </div>

      {/* Post Body */}
      <div className="post-body">
        {post.videoUrl ? (
          <iframe
            width="100%"
            height="300"
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
        ) : <></>}
        <p>{post.description}</p>
      </div>

      {/* Post Footer */}
      <div className="post-footer">
        <button
          onClick={handleLikeToggle}
          className={`like-button ${isLiked ? "liked" : ""}`}
        >
          <Heart /> Like ({likes})
        </button>
        <button onClick={toggleComments} className="comment-button">
          <MessageCircle /> Comments
        </button>
        <button className="share-button">
          <Share2 /> Share
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          {comments.map((comment, index) => (
            <Comment key={index} comment={comment} />
          ))}
          <form onSubmit={handleCommentSubmit}>
            <div className="w-100 d-flex flex-row align-items-center mt-4">
              {/* Input Field: Takes full width */}
              <div className="flex-grow-1">
                <input
                  className="w-100 beatsnap-input"
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <div className="ms-auto ps-4">
                {/* Post Button: Aligned to the right */}
                <button type="submit" className="btn btn-primary text-nowrap">
                  <span className="p-2">Post</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default MusicPost;
