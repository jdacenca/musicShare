import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import album2 from "../assets/images/album2.jpg";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user3.jpg";
import "../styles/MusicFeed.css";
import CreatePostPopup from "./CreatePostPopup";
import MusicPost from "./MusicPost";

function MusicFeed() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  const [posts, setPosts] = useState([]);
  const [postContent, setPostContent] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  const handlePost = () => {
    if (postContent.trim()) {
      console.log("Post created:", postContent); // Replace with API or post logic
      setPostContent(""); // Clear the input field
    }
  };

  useEffect(() => {
    // Mock data for posts
    setPosts([
      {
        id: 1,
        username: "priya_gounalan",
        title: "Musik Freak",
        time: "5h",
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
        username: "melody_lovz",
        title: "Lil A-Z",
        time: "10h",
        userImage: user2,
        description: "This song hits different!",
        likes: 5,
        comments: [{ username: "user3", text: "Can’t stop listening!" }],
        musicImage: album2,
      },
      {
        id: 3,
        username: "vinyl_vibes_15",
        title: "Weekdaz",
        time: "11h",
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
      <div
        className={`post-creator-container m-4 p-4 pb-0 ${
          isDarkMode ? "dark-mode" : ""
        }`}
      >
        <div className="user-info">
          <img
            src="https://via.placeholder.com/40" // Replace with user profile image URL
            alt="User"
            className="user-avatar"
          />
          <div>
            <h4 className="user-name">Kelvin Li</h4>
            <p className="user-role">Music Buff • Now</p>
          </div>
        </div>
        <div className="d-flex flex-row align-items-center">
          <div className="w-100 flex-grow-1">
            <textarea
              className="post-input w-100 "
              placeholder="What's on your mind today?"
              value={postContent}
              onChange={handleInputChange}
            />
          </div>
          <div
            className="post-actions ms-auto ps-4 align-self-start"
            onClick={() => setPopupVisible(true)}
          >
            <button
              className="btn btn-primary w-100 text-nowrap"
              onClick={handlePost}
            >
              + Create a Post
            </button>
          </div>
          {isPopupVisible && (
            <CreatePostPopup onClose={() => setPopupVisible(false)} />
          )}
        </div>
      </div>
      {posts.map((post) => (
        <MusicPost key={post.id} post={post} />
      ))}
    </>
  );
}

export default MusicFeed;
