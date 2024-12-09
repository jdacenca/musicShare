import {
  React,
  useState,
  useRef,
  useEffect,
  useSelector,
  apiUrl
} from "../CommonImports";
import { Heart, MessageCircle, MoreHorizontal, Share2, X } from "react-feather";
import "../styles/MusicPost.css";
import Comment from "./Comment";
import PostPopup from "./PostPopup";
import NameCard from "./NameCard";
import moment from "moment";

function MusicPost({ post, onDelete, cardType = "large" }) {
  const isDarkMode = useSelector((state) => state.beatSnapApp.isDarkMode);

  const [isLiked, setIsLiked] = useState(false); // Tracks whether the post is liked
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(post.comments);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // Tracks whether the menu is visible
  const [showShareMenu, setShowShareMenu] = useState(false); // Tracks whether the menu is visible
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const link = `${window.location.protocol}//${window.location.host}/post?id=${post.id}`;

  const currentUser = useSelector((state) => state.beatSnapApp.currentUser);
  const popupRef = useRef(null);
  const sharePopupRef = useRef(null);

  const [isPostPopupVisible, setPostPopupVisible] = useState(false);
  const [isPostDelete, setPostDelete] = useState(false);

  moment.locale('en', {
    relativeTime : {
        future: "%s",
        past:   "%ss",
        s:  "%ss",
        m:  "%dm",
        mm: "%dm",
        h:  "%dh",
        hh: "%dh",
        d:  "%dd",
        dd: "%dd",
        M:  "%dm",
        MM: "%dm",
        y:  "$dy",
        yy: "%dy"
    }
});

useEffect(() => {
  async function postCount() {
    try {
      const response = await fetch(apiUrl + "/post/like/count", {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({"postId": post.id})
      });

      const data = await response.json();

      if (response.status == 200) {
        setLikes(data.count);
      } else {
        console.log("Error")
      }
    } catch (err) {
      console.log("Error");
      console.log(err)
    }
  }

  async function userPostLike() {
    try {
      const response = await fetch(apiUrl + "/post/like?" + new URLSearchParams({
        postId : post.id,
        userId: currentUser.userId
      }), {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "GET"
      });

      const data = await response.json();

      if (response.status == 200) {
        setIsLiked(data);
      } else {
        console.log("Error")
      }
    } catch (err) {
      console.log("Error");
      console.log(err)
    }
  }

  userPostLike();
  postCount();
}, []);

  const handleLikeToggle = async () => {
    const response = await fetch(apiUrl + "/post/like/update", {
      headers: {
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({"postId": post.id, userId: currentUser.userId})
    });

    const data = await response.json();
      
    if (response.status == 200) {

    } else {
      console.log("Error")
    }

    setLikes(isLiked ? parseInt(likes) - 1 : parseInt(likes) + 1); // Increment or decrement likes
    setIsLiked(!isLiked); // Toggle like state
  };

  useEffect(() => { console.log(comments) }, [comments])

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!commentText) {
        alert('Please enter your comment.');
        return;
      }
  
      const response = await fetch(apiUrl + "/post/comment", {
        headers: {
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({"postId": post.id, "comment": commentText, userId: currentUser.userId})
      });
  
      const data = await response.json();
      
      if (response.status == 200) {
        if (commentText) {
          toggleComments(false);
          setCommentText("")
        }
  
      } else  {
        alert('Unable to post comment!');
        return;
      }
    } catch (err) {
      console.log("Error");
      console.log(err);
    }
    
  };

  const toggleComments = async (isClose) => {
    try {
      let commentList = [];
      const result = await fetch(apiUrl + "/post/comment?" + new URLSearchParams({
        postId: post.id
      }), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      });

      if (result.status == 200) {
        const data = await result.json();
        
        data.forEach((x) => {
          let timeAgo = moment(x.created_timestamp).fromNow();

          let postComment = {
            postId: x.id,
            name: x.name,
            comment: {username:x.name, text:x.comment},
            profilePic: x.profile_pic_url,
            time: timeAgo,
          };

          commentList.push(postComment)
        })
      }
      
      setComments(commentList);
    } catch (err) {
      console.log("Error");
      console.log(err);
    }
  
    if (isClose) {
      setShowComments(!showComments);
    }
    
  }
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
        alert("Account details action triggered");
        break;
      default:
        break;
    }
  };

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

  return (
    <div
      className={`music-post card shadow-xss rounded-xxl border-0  ${
        cardType === 'large' ? "p-4" : ""
      }  ${
        isDarkMode ? "dark-mode" : ""
      }`}
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
          <iframe
            width={cardType === "large" ? "100%" : ""}
            height={cardType === "large" ? "300px" : "150px"} 
            src={post.videoUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : post.spotifyUrl ? (
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
                <img src={comment.profilePic} alt="User" className="user-avatar" />
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
