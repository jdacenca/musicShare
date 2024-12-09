import "bootstrap/dist/css/bootstrap.css";
import {
  React,
  useEffect,
  useSelector,
  apiUrl,
  useState,
} from "../CommonImports";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import SideBar from "../components/SideBar";
import { useSearchParams } from "react-router-dom";
import MusicPost from "../components/MusicPost";
import moment from "moment";

import "../styles/PostPage.css";

// PostPage component
const PostPage = () => {
  // useSearchParams hook to get and set query parameters from the URL
  const [searchParams, setSearchParams] = useSearchParams();

  // Extract the 'id' parameter from the query string
  const id = searchParams.get("id");

  // Access Redux state to check if Dark Mode is enabled
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  // Access the current logged-in user's information from Redux
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);

  // useState hook to manage the state of the post
  const [post, setPost] = useState({});

  // Fetch post data when the 'id' parameter changes
  useEffect(() => {
    async function fetchPostData(id) {
      
      // Fetch post details from the API
      const response = await fetch(apiUrl + "/post/get?id=" + id);
      const x = await response.json();

      let timeAgo = moment(x.created_timestamp).fromNow();

      // Constructing structured object for the post
      let item = {
        id: x.id,
        userId: x.user_id,
        username: x.name,
        _username: x.username,
        profilePic: x.profile_pic_url,
        title: x.status,
        time: timeAgo,
        description: x.message,
        likes: x.no_of_likes ? x.no_of_likes : 0,
        comments: [],
        canApiDelete: currentUser.userId == x.user_id ? true : false,
      };

      // Check if the post contains a Spotify URL or a video URL
      if (x.music_url && x.music_url.indexOf("spotify") !== -1) {
        item.spotifyUrl = x.music_url; // Spotify link
      } else {
        item.videoUrl = x.music_url; // Video link
      }

      // Update the post state
      setPost(item);
    }
    if (id) {
      fetchPostData(id); // Fetch post data only if 'id' is provided

    }
  }, [id]); // Re-run the effect when 'id' changes

  // Render the PostPage layout
  return (
    <div
      id="app-container-id"
      className={`app-container ${isDarkMode ? "dark-mode" : ""}`}
    >
      {/* Render Header component */}
      <Header />
      <div className="row g-0">
        {/* NavBar (Left Sidebar) */}
        <div className="d-none d-md-block p-4 pe-0 col-md-2">
          <NavBar />
        </div>
        {/* Music Feed (Center Content) */}
        <div className="col-12 col-md-7 post-page-container pe-4">
          {post && post.id && <MusicPost post={post} />}
        </div>
        {/* Trending Section (Right Sidebar) */}
        <div className="d-none d-md-block col-md-3 trending-container">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default PostPage;
