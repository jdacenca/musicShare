import React, { useState } from 'react';
import Comment from './Comment';
import "../styles/MusicPost.css";

function MusicPost({ post }) {
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText) {
      setComments([...comments, { username: 'current_user', text: commentText }]);
      setCommentText('');
    }
  };

  return (
    <div className="music-post card w-100 shadow-xss rounded-xxl border-0 p-4 mb-3">
      <div className="post-header">
        <img src={post.userImage} alt="User" className="user-avatar" />
        <h3>{post.username}</h3>
      </div>
      <div className="post-body">
        <img src={post.musicImage} alt="Music Cover" className="music-cover" />
        <p>{post.description}</p>
      </div>
      <div className="post-footer">
        <button className="like-button" onClick={handleLike}>
          Like ({likes})
        </button>
        <button className="comment-button">Comment</button>
        <button className="share-button">Share</button>
      </div>
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
    </div>
  );
}

export default MusicPost;
