import {
  React,
  useEffect,
  useState,
  useSelector,
  useDispatch,
  apiUrl,
} from "../CommonImports";
import user1 from "../assets/images/user1.jpg";
import user2 from "../assets/images/user2.jpg";
import user3 from "../assets/images/user3.jpg";
import spotify from "../assets/images/spotify.jpg";
import "../styles/MusicFeed.css";
import PostPopup from "./PostPopup";
import MusicPost from "./MusicPost";
import NameCard from "./NameCard";
import { setRecommendations } from "../redux/slice";

export const mockData = [
  {
    id: 1,
    username: "pgounalan",
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
    //musicImage: album2,
    spotifyUrl: "2Z51EnLF4Nps4LmulSQPnn",
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
];

function MusicFeed() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const dispatch = useDispatch();

  const [posts, setPosts] = useState(mockData);
  const [postContent, setPostContent] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  const onPostDelete = (id) => {
    const newArray = posts.filter((item) => item.id !== id);
    setPosts(newArray);
  };

  const handlePost = () => {
    if (postContent.trim()) {
      setPostContent(""); // Clear the input field
    }
  };

  useEffect(() => {
    async function fetchTimelineData() {
      let postsArray = [...posts];

      let len = postsArray.length;
      let count = 1;

      try {
        const recommendations = await fetch(
          apiUrl + "/spotify/recommendations?genre=rock"
        );
        const recommendationsData = await recommendations.json();
        dispatch(setRecommendations(recommendationsData));

        recommendationsData?.tracks?.forEach((x) => {
          postsArray.push({
            id: len + count,
            username: "Spotify",
            title: x.album?.name,
            //time: "11h",
            userImage: spotify,
            description: "",
            likes: 0,
            comments: [
              { username: "user4", text: "Brings back memories!" },
              { username: "user5", text: "An all-time favorite!" },
            ],
            spotifyUrl: x.album?.id,
          });
          count++;
        });
      } catch {}

      setPosts(postsArray);
    }
    fetchTimelineData();
  }, [dispatch]);

  return (
    <>
      <div
        className={`feed-post-creator-container m-4 p-4 pb-0 ${
          isDarkMode ? "dark-mode" : ""
        }`}
      >
        <NameCard
          user={{
            username: currentUser?.fullname,
            title: currentUser?.status,
            time: "Now",
          }}
        />
        <div className="d-flex flex-row align-items-center">
          <div className="w-100 flex-grow-1">
            <textarea
              className={`feed-post-input w-100 ${
                isDarkMode ? "dark-mode" : ""
              }`}
              placeholder="What's on your mind today?"
              value={postContent}
              onChange={handleInputChange}
            />
          </div>
          <div
            className="feed-post-actions ms-auto ps-4 align-self-start"
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
            <PostPopup onClose={() => setPopupVisible(false)} />
          )}
        </div>
      </div>
      {posts.slice(0, 15).map((post, index) => (
        <MusicPost
          key={post.id}
          post={post}
          onDelete={() => onPostDelete(post.id)}
        />
      ))}
    </>
  );
}

export default MusicFeed;
