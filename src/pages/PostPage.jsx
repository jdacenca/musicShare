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

const PostPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const [post, setPost] = useState({});

  useEffect(() => {
    async function fetchPostData(id) {
      const response = await fetch(apiUrl + "/post/get?id=" + id);
      const x = await response.json();
      let timeAgo = moment(x.created_timestamp).fromNow();

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

      if (x.music_url && x.music_url.indexOf("spotify") !== -1) {
        item.spotifyUrl = x.music_url;
      } else {
        item.videoUrl = x.music_url;
      }

      setPost(item);
    }
    if (id) {
      fetchPostData(id);
    }
  }, [id]);

  return (
    <div
      id="app-container-id"
      className={`app-container ${isDarkMode ? "dark-mode" : ""}`}
    >
      <Header />
      <div className="row g-0">
        {/* NavBar (Left Sidebar) */}
        <div className="d-none d-md-block p-4 pe-0 col-md-2">
          <NavBar />
        </div>
        {/* Music Feed (Center Content) */}
        <div className="col-12 col-md-7 post-page-container pe-4">
          {post && post.id && (<MusicPost post={post} />)}
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
