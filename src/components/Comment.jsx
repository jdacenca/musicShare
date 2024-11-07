import React from 'react';

function Comment({ comment }) {
  return (
    <div className="comment">
      <strong>{comment.username}</strong>: {comment.text}
    </div>
  );
}

export default Comment;
