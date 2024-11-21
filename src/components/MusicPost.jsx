import React, { useState } from "react";
import Comment from "./Comment";
import "../styles/MusicPost.css";
import { Heart, MessageCircle, Share2, MoreHorizontal, X } from "react-feather";

function MusicPost({ isDarkMode, post }) {
  const [isLiked, setIsLiked] = useState(false); // Tracks whether the post is liked
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Tracks whether the menu is visible

  const handleLikeToggle = () => {
    setLikes(isLiked ? likes - 1 : likes + 1); // Increment or decrement likes
    setIsLiked(!isLiked); // Toggle like state
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText) {
      setComments([...comments, { username: "current_user", text: commentText }]);
      setCommentText("");
    }
  };

  const toggleComments = () => setShowComments(!showComments);
  const toggleMenu = () => setShowMenu(!showMenu); // Toggles the 3-dots menu

  const handleAction = (action) => {
    switch (action) {
      case "edit":
        alert("Edit action triggered");
        break;
      case "delete":
        alert("Delete action triggered");
        break;
      case "account-details":
        alert("Account details action triggered");
        break;
      case "cancel":
        setShowMenu(false); // Close the menu
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`music-post card shadow-xss rounded-xxl border-0 p-4 mb-3 ${
        isDarkMode ? "dark-mode" : ""
      }`}
    >
      {/* Post Header */}
      <div className="post-header">
        <img
          src={post.userImage || "default-user.png"}
          alt="User"
          className="user-avatar"
        />
              <p>{post.username || "Anonymous"}</p>
        <div className="post-header-actions">
          <button className="menu-button" onClick={toggleMenu}>
            <MoreHorizontal />
          </button>
          {showMenu && (
            <div className="menu-popup">
              <ul>
                <li onClick={() => handleAction("edit")}>Edit</li>
                <li onClick={() => handleAction("delete")}>Delete</li>
                <li onClick={() => handleAction("account-details")}>
                  Account Details
                </li>
                <li onClick={() => handleAction("cancel")}>Cancel</li>
              </ul>
            </div>
          )}
          <button className="close-button">
            <X />
          </button>
        </div>
      </div>

      {/* Post Body */}
      <div className="post-body">
        {post.videoUrl ? (
          <iframe
            width="100%"
            height="500"
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
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              style={{ width: "80%" }}
            />
            <button
              type="submit"
              className={`post-button ${
                isDarkMode ? "dark-mode" : "light-mode"
              }`}
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MusicPost;
