import React from 'react';

// A container for the comment
function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.username}</strong>: {comment.text}
    </div>
  );
}

export default Comment;
