import React, { useState, useEffect } from "react";
import MusicPost from "./MusicPost";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user3.jpg";
import album2 from "../assets/images/album2.jpg";

function MusicFeed({ isDarkMode }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Mock data for posts
    setPosts([
      {
        id: 1,
        username: "Priya Gounalan",
        userImage: user1,
        description: "Check out this awesome track!",
        likes: 10,
        comments: [
          { username: "user1", text: "Love this!" },
          { username: "user2", text: "Amazing track!" },
        ],
        videoUrl: "https://www.youtube.com/embed/CevxZvSJLk8", // Video link
      },
      {
        id: 2,
        username: "Melody_lover",
        userImage: user2,
        description: "This song hits different!",
        likes: 5,
        comments: [
          { username: "user3", text: "Can’t stop listening!" },
        ],
        musicImage: album2,
      },
      {
        id: 3,
        username: "vinyl_vibes",
        userImage: user3,
        description: "Throwback vibes with memories!",
        likes: 15,
        comments: [
          { username: "user4", text: "Brings back memories!" },
          { username: "user5", text: "An all-time favorite!" },
        ],
        spotifyUrl: "3nR9B40hYLKLcR0Eph3Goc", // Spotify track ID for Memories
      },
    ]);
  }, []);

  return (
    <>
      {posts.map((post) => (
        <MusicPost key={post.id} isDarkMode={isDarkMode} post={post} />
      ))}
    </>
  );
}

export default MusicFeed;
