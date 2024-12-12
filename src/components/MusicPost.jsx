import {
  React,
  useState,
  useRef,
  useEffect,
  useSelector,
  apiUrl,
  useDispatch,
} from "../CommonImports";
import { Heart, MessageCircle, MoreHorizontal, Share2, X } from "react-feather";
import "../styles/MusicPost.css";
import Comment from "./Comment";
import PostPopup from "./PostPopup";
import { useNavigate } from "react-router-dom";
import NameCard from "./NameCard";
import moment from "moment";
import { setLiveData } from "../redux/slice";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// MusicPost Component - Displays individual music posts
function MusicPost({ post, onDelete, cardType = "large" }) {
  // Application states and hooks
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);
  const liveData = useSelector((state) => state.beatSnapApp.liveData);
  const navigate = useNavigate();

  // Component states
  const [isLiked, setIsLiked] = useState(false); // Tracks whether the post is liked
  const [likes, setLikes] = useState(0); // Total likes count
  const [comments, setComments] = useState(post.comments); // Post comments
  const [commentText, setCommentText] = useState(""); // Text for a new comment
  const [showComments, setShowComments] = useState(false); // Toggle comments visibility
  const [showMenu, setShowMenu] = useState(false); // Tracks whether the menu is visible
  const [showShareMenu, setShowShareMenu] = useState(false); // Tracks whether the menu is visible
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility
  const [isPostPopupVisible, setPostPopupVisible] = useState(false); // Popup visibility
  const [isPostDelete, setPostDelete] = useState(false); // Post deletion flag
  const [playing, setPlaying] = useState(false);

  const currentUser = useSelector((state) => state.beatSnapApp.currentUser); // Current user info
  const popupRef = useRef(null); // Reference for options menu popup
  const sharePopupRef = useRef(null); // Reference for share menu popup

  let videoId = "";
  if (post.videoUrl) {
    videoId = post.videoUrl.split("/").pop();
    console.log(post.videoUrl, videoId);
  }

  // link to the post
  const link = `${window.location.protocol}//${window.location.host}/post?id=${post.id}`;

  // Moment.js locale customization for relative time display
  moment.locale("en", {
    relativeTime: {
      future: "%s",
      past: "%ss",
      s: "%ss",
      m: "%dm",
      mm: "%dm",
      h: "%dh",
      hh: "%dh",
      d: "%dd",
      dd: "%dd",
      M: "%dm",
      MM: "%dm",
      y: "$dy",
      yy: "%dy",
    },
  });

  // Fetch initial post like count and user-specific like status
  useEffect(() => {
    async function postCount() {
      try {
        const response = await fetch(apiUrl + "/post/like/count", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ postId: post.id }),
        });

        const data = await response.json();

        if (response.status == 200) {
          setLikes(data.count);
        } else {
          console.log("Error");
        }
      } catch (err) {
        console.log("Error");
        console.log(err);
      }
    }

    async function userPostLike() {
      try {
        const response = await fetch(
          apiUrl +
            "/post/like?" +
            new URLSearchParams({
              postId: post.id,
              userId: currentUser.userId,
            }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            method: "GET",
          }
        );

        const data = await response.json();

        if (response.status == 200) {
          setIsLiked(data);
        } else {
          console.log("Error");
        }
      } catch (err) {
        console.log("Error");
        console.log(err);
      }
    }

    userPostLike();
    postCount();
  }, []);

  // Toggle like status for the post
  const handleLikeToggle = async () => {
    const response = await fetch(apiUrl + "/post/like/update", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ postId: post.id, userId: currentUser.userId }),
    });

    const data = await response.json();

    if (response.status == 200) {
    } else {
      console.log("Error");
    }

    setLikes(isLiked ? parseInt(likes) - 1 : parseInt(likes) + 1); // Increment or decrement likes
    setIsLiked(!isLiked); // Toggle like state
  };

  useEffect(() => {
    //console.log(comments);
  }, [comments]);

  // Handle comment submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!commentText) {
        toast("Please enter your comment.");
        return;
      }

      const response = await fetch(apiUrl + "/post/comment", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          postId: post.id,
          comment: commentText,
          userId: currentUser.userId,
        }),
      });

      const data = await response.json();

      if (response.status == 200) {
        if (commentText) {
          toggleComments(false);
          setCommentText("");
        }
      } else {
        toast("Unable to post comment!");
        return;
      }
    } catch (err) {
      console.log("Error");
      console.log(err);
    }
  };

  // Fetch and toggle comments visibility
  const toggleComments = async (isClose) => {
    try {
      let commentList = [];
      const result = await fetch(
        apiUrl +
          "/post/comment?" +
          new URLSearchParams({
            postId: post.id,
          }),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (result.status == 200) {
        const data = await result.json();

        data.forEach((x) => {
          let timeAgo = moment(x.created_timestamp).fromNow();

          let postComment = {
            postId: x.id,
            name: x.name,
            comment: { username: x.name, text: x.comment },
            profilePic: x.profile_pic_url,
            time: timeAgo,
          };

          commentList.push(postComment);
        });
      }

      setComments(commentList);
    } catch (err) {
      console.log("Error");
      console.log(err);
    }

    if (isClose) {
      setShowComments(!showComments);
    }
  };

  // Event handler for post actions (edit, delete, etc.)
  const handleAction = (action) => {
    setShowMenu(false); // Close the menu
    switch (action) {
      case "edit":
        setPostDelete(false);
        setPostPopupVisible(true);
        break;
      case "hide":
        onDelete();
        break;
      case "delete":
        setPostDelete(true);
        setPostPopupVisible(true);
        break;
      case "account-details":
        currentUser.userId === post.userId
          ? navigate(`/userpage`)
          : navigate(`/userpage?username=${post._username}`);
        break;
      default:
        break;
    }
  };

  // Event handler for sharing actions (WhatsApp, copy link)
  const handleShareAction = (action) => {
    setShowShareMenu(false); // Close the menu
    switch (action) {
      case "whatsapp":
        const shareText = `Check this out: ${link}`;
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
          shareText
        )}`;
        window.open(whatsappUrl);
        break;
      case "copylink":
        navigator.clipboard
          .writeText(link)
          .then(() => {
            setSnackbarVisible(true);
            setTimeout(() => {
              setSnackbarVisible(false);
            }, 3000);
          })
          .catch((err) => {});
      default:
        break;
    }
  };

  // Closes the popup when clicking outside of it
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowMenu(false);
    }

    if (
      sharePopupRef.current &&
      !sharePopupRef.current.contains(event.target)
    ) {
      setShowShareMenu(false);
    }
  };

  // Attach and detach the event listener
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const playerRef = useRef(null);

  useEffect(() => {
    if (playing && liveData?.post?.id && liveData.post.id !== post.id) {
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
        setPlaying(false);
      } else {
        console.error("Player is not ready yet or pauseVideo is unavailable.");
      }
    }
  }, [liveData]);

  useEffect(() => {
    // Load the YouTube Player when the component mounts
    if (videoId) {
      // Function to initialize the YouTube Player
      const loadYouTubePlayer = () => {
        playerRef.current = new window.YT.Player(`youtube-player-${videoId}`, {
          videoId: videoId,
          events: {
            onStateChange: onPlayerStateChange,
          },
        });
      };

      // Check if the YouTube API is already available
      if (!window.YT || !window.YT.Player) {
        // Load the YouTube API
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.body.appendChild(script);

        // Wait for the API to be ready
        window.onYouTubeIframeAPIReady = loadYouTubePlayer;
      } else {
        // If the API is already loaded
        loadYouTubePlayer();
      }

      return () => {
        // Cleanup: Destroy the player when the component unmounts
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }
  }, []);

  // Event listener for state changes
  const onPlayerStateChange = (event) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setPlaying(true);
        dispatch(setLiveData({ state: "playing", post: { ...post } }));
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={`music-post card shadow-xss rounded-xxl border-0  ${
        cardType === "large" ? "p-4" : ""
      }  ${isDarkMode ? "dark-mode" : ""}`}
    >
      {/* Post Header */}
      {cardType === "large" && (
        <div className="post-header">
          <NameCard user={post} />
          <p></p>
          <div className="post-header-actions">
            <button
              className="post-menu-button"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal />
            </button>
            {showMenu && (
              <div className="post-menu-popup" ref={popupRef}>
                <ul>
                  {currentUser.userId === post.userId && (
                    <>
                      <li onClick={() => handleAction("edit")}>Edit</li>
                      <li onClick={() => handleAction("delete")}>Delete</li>
                    </>
                  )}
                  <li onClick={() => handleAction("account-details")}>
                    Account Details
                  </li>
                  <li onClick={() => handleAction("cancel")}>Cancel</li>
                </ul>
              </div>
            )}
            {isPostPopupVisible && (
              <PostPopup
                type={isPostDelete ? "DELETE" : "UPDATE"}
                onClose={() => setPostPopupVisible(false)}
                post={post}
                onDelete={() => {
                  setPostPopupVisible(false);
                  onDelete();
                }}
              />
            )}
            <button
              className="close-button"
              onClick={() => handleAction("hide")}
            >
              <X />
            </button>
          </div>
        </div>
      )}

      {/* Post Body */}
      <div className="post-body">
        {post.videoUrl ? (
          <div
            id={`youtube-player-${videoId}`}
            style={{ width: "100%", height: "300px" }}
          ></div>
        ) : // <iframe
        //   ref={iframeRef}
        //   width={cardType === "large" ? "100%" : ""}
        //   height={cardType === "large" ? "300px" : "150px"}
        //   src={post.videoUrl + '?enablejsapi=1'}
        //   title="YouTube video player"
        //   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        //   allowFullScreen
        // ></iframe>
        post.spotifyUrl ? (
          <iframe
            src={`${post.spotifyUrl}`}
            width={cardType === "large" ? "100%" : ""}
            height={cardType === "large" ? "360px" : "150px"}
            allow="encrypted-media"
            allowFullScreen
            title="Spotify player"
          ></iframe>
        ) : (
          <></>
        )}
        {cardType === "large" && <p>{post.description}</p>}
      </div>

      {/* Post Footer */}
      {cardType === "large" && (
        <div className="post-footer">
          <button
            onClick={handleLikeToggle}
            className={`like-button ${isLiked ? "liked" : ""}`}
          >
            <Heart /> Like ({likes})
          </button>
          <button onClick={toggleComments} className="comment-button">
            <MessageCircle /> Comments
          </button>
          <button
            className="share-button"
            onClick={() => setShowShareMenu(!showShareMenu)}
          >
            <Share2 /> Share
          </button>
          {showShareMenu && (
            <div className="post-share-menu" ref={sharePopupRef}>
              <ul>
                <li onClick={() => handleShareAction("whatsapp")}>WhatsApp</li>
                <li onClick={() => handleShareAction("copylink")}>Copy Link</li>
                <li onClick={() => handleShareAction("cancel")}>Cancel</li>
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Comments Section */}
      {showComments && (
        <div className="post-comments-section">
          {comments?.map((comment, index) => (
            <div className="comment-line">
              <div className="sub-item" key={index}>
                <img
                  src={comment.profilePic}
                  alt="User"
                  className="user-avatar"
                />
                <Comment key={index} comment={comment.comment} />
                <span className="com-time">{comment.time}</span>
              </div>
            </div>
          ))}
          <form className="post-form-section" onSubmit={handleCommentSubmit}>
            <div className="w-100 d-flex flex-row align-items-center mt-4">
              {/* Input Field: Takes full width */}
              <div className="flex-grow-1">
                <input
                  className="w-100 beatsnap-input"
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <div className="ms-auto ps-4">
                {/* Post Button: Aligned to the right */}
                <button type="submit" className="btn btn-primary text-nowrap">
                  <span className="p-2">Post</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {snackbarVisible && (
        <div className="post-snackbar">Link copied to clipboard!</div>
      )}
    </div>
  );
}

export default MusicPost;
