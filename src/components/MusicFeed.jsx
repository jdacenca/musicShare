import moment from "moment";
import {
  apiUrl,
  React,
  useDispatch,
  useEffect,
  useSelector,
  useState,
} from "../CommonImports";
import spotify from "../assets/images/spotify.jpg";
import { setPosts, setRecommendations } from "../redux/slice";
import "../styles/MusicFeed.css";
import MusicPost from "./MusicPost";
import PostPopup from "./PostPopup";

function MusicFeed() {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const posts = useSelector((state) => state.beatSnapApp.posts);
  const dispatch = useDispatch();

  const [postContent, setPostContent] = useState("");
  const [isPopupVisible, setPopupVisible] = useState(false);

  const handleInputChange = (event) => {
    setPostContent(event.target.value);
  };

  const onPostDelete = (id) => {
    const newArray = posts.filter((item) => item.id !== id);
    dispatch(setPosts(newArray));
  };

  useEffect(() => {
    async function fetchTimelineData() {

      let postsArray = [];
      try {
        const apiPosts = await fetch(apiUrl + "/posts", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.userId,
            sort: "DESC",
          }),
        });
        const apiPostsData = await apiPosts.json();

        // "id": "PST000043",
        // "message": "test",
        // "music_url": "",
        // "created_timestamp": "2024-12-01T06:33:39.331Z",
        // "updated_timestamp": null,
        // "no_of_likes": 0,
        // "user_id": "ACC0000014",
        // "is_deleted": false

        apiPostsData.forEach((x) => {
          let timeAgo = moment(x.created_timestamp).fromNow();
          //timeAgo = timeAgo.replace('in','');
          let item = {
            id: x.id,
            userId: x.user_id,
            username: x.name,
            profilePic: x.profile_pic_url,
            title: x.status,
            time: timeAgo,
            description: x.message,
            likes: x.no_of_likes,
            comments: [],
            canApiDelete: currentUser.userId == x.user_id ? true : false,
          };

          if (x.music_url && x.music_url.indexOf("spotify") !== -1) {
            item.spotifyUrl = x.music_url;
          } else {
            item.videoUrl = x.music_url;
          }
          postsArray.push(item);
        });

        //dispatch(setPosts(postsArray));
      } catch {}

      let len = postsArray.length;
      let count = 1;

      try {
        await fetch(apiUrl + "/spotify/connect", {
          method: "POST",
        });

        let interests = currentUser.interest.length > 0 ? (currentUser.interest).join(',') : "world-music";
        const recommendations = await fetch(
          apiUrl + "/spotify/recommendations?genre=" + interests
        );
        const recommendationsData = await recommendations.json();
        dispatch(setRecommendations(recommendationsData));

        // Only load 3 recommendations
        recommendationsData?.tracks.items.forEach((x) => {
          if (count < 10) {
            postsArray.push({
              id: len + count,
              username: "Spotify",
              title: x.name,
              time: "Now",
              profilePic: spotify,
              description: "Recommendation",
              likes: 0,
              comments: [],
              spotifyUrl: "https://open.spotify.com/embed/track/" + x.id,
              canApiDelete: false,
            });
          }

          count++;
        });

      } catch (err) {
        console.log("Error:");
        console.log(err);
      }

      dispatch(setPosts(postsArray));
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
        <div className="d-flex flex-row align-items-center">
          <div className="w-100 flex-grow-1">
            <textarea
              className={`feed-post-input w-100 mb-0 ${
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
            <button className="btn btn-primary w-100 text-nowrap">
              + Create a Post
            </button>
          </div>
          {isPopupVisible && (
            <PostPopup
              onClose={() => setPopupVisible(false)}
              postInitContent={postContent}
            />
          )}
        </div>
      </div>

        {posts.map((post, index) => (
          <div className="m-4" key={post.id}>
            <MusicPost post={post} onDelete={() => onPostDelete(post.id)} />
          </div>
        ))}
    </>
  );
}

export default MusicFeed;
