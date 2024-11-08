import React, { useState } from "react";
import Comment from "./Comment";
import "../styles/MusicPost.css";
import { Heart, MessageCircle, Share2 } from "react-feather";

function MusicPost({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    setLikes(likes + 1);
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

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="music-post card shadow-xss rounded-xxl border-0 p-4 mb-3">
      <div className="post-header">
        <img
          src={post.userImage || "default-user.png"}
          alt="User"
          className="user-avatar"
        />
        <h3>{post.username || "Anonymous"}</h3>
      </div>
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
      <div className="post-footer">
        <button onClick={handleLike} className="like-button">
          <Heart /> Like ({likes})
        </button>
        <button onClick={toggleComments} className="comment-button">
          <MessageCircle /> Comments
        </button>
        <button className="share-button">
          <Share2 /> Share
        </button>
      </div>
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
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default MusicPost;
