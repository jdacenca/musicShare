import React, { useState, useEffect } from 'react';
import MusicPost from './MusicPost';
import user1 from '../assets/images/user1.jpg';
import user2 from '../assets/images/user2.jpg';
import album1 from '../assets/images/album1.jpg';
import album2 from '../assets/images/album2.jpg';


function MusicFeed() {
  const [posts, setPosts] = useState([]);


  useEffect(() => {
    // Mock data for posts
    setPosts([
      {
        id: 1,
        username: 'dj_breezy',
        userImage: user1,
        musicImage: album1,
        description: 'Check out this awesome track!',
        likes: 10,
        comments: [
          { username: 'user1', text: 'Love this!' },
          { username: 'user2', text: 'Amazing track!' },
        ],
      },
      {
        id: 2,
        username: 'melody_lover',
        userImage: user2,
        musicImage: album2,
        description: 'This song hits different!',
        likes: 5,
        comments: [
          { username: 'user3', text: 'Can’t stop listening!' },
        ],
      },
    ]);
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <MusicPost key={post.id} post={post} />
      ))}
    </div>
  );
}

export default MusicFeed;
