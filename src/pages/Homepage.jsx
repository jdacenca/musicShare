import "bootstrap/dist/css/bootstrap.css";
import {
  React,
  useEffect,
  useDispatch,
  useSelector,
  apiUrl,
} from "../CommonImports";
import Header from "../components/Header";
import MusicFeed from "../components/MusicFeed";
import NavBar from "../components/Navbar";
import SideBar from "../components/SideBar";

import { setTrendingMusic } from "../redux/slice";
import "../styles/Homepage.css";

// Homepage component
const Homepage = () => {
  // Access Redux state to check if Dark Mode is enabled
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  // Hook to get the dispatch function for Redux actions
  const dispatch = useDispatch();

  // Fetch trending music data from Spotify API on component mount
  useEffect(() => {
    async function fetchSpotifyData() {
      await fetch(apiUrl + "/spotify/connect", {
        method: "POST",
      });
      const response = await fetch(apiUrl + "/spotify/trending");
      const data = await response.json();
      dispatch(setTrendingMusic(data));
    }
    fetchSpotifyData();
  }, [dispatch]);

  // Render the Homepage layout
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
        <div className="col-12 col-md-7 music-feed-container">
          <MusicFeed />
        </div>
        {/* Trending Section (Right Sidebar) */}
        <div className="d-none d-md-block col-md-3 trending-container">
          <SideBar />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
