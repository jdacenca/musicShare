import dotenv from "dotenv";
import express from "express";
import http from "http";

import { spotifyAuth, spotifyAuthFunc } from "./utils/spotifyAuth.js";
import { spotifyGlobalTopHits } from "./utils/spotifyGlobalTopHits.js";
import { spotifyGenreRecommendation } from "./utils/spotifyGenreRecommendation.js";
import { youtubeMusic } from "./utils/youTubeSearchMusicCategory.js";
import { databaseConnect,
  databaseDisconnect,
  getPostWithFollowing,
  insertPost,
  updatePostMessage,
  updatePostLike,
  deletePostMessage,
  updateUser,
  getUserConnections,
  getPostCount,
  getUserFollowersCount,
  getUserFollowingCount,
  getAllUserPost,
  getUserGenre,
  insertUserGenre } from "./utils/databaseHelper.js";
import { uploadPhoto } from "./utils/storePhotos.js";
import { sendEmail } from "./utils/sendEmail.js";
import { router, databasePoolConnect, authenticateToken } from "./utils/authRoutes.js";
import  notificationsRoutes  from './utils/notification.js';  




import process from 'node:process';
import cors from "cors";
import multer from "multer";

dotenv.config({ path: "../.env" });

const app = express();
const server = http.createServer(app);

/*app.use((req, res, next) => {
  if (req.path.startsWith("/socket.io")) {
    return next(); // Skip middleware for WebSocket connections
  }
  // Other middleware can be added here
  next();
});
*/


app.use(cors());

app.use(express.json());

const port = process.env.PORT || 8777;

// connect to database
let client = databaseConnect();
let clientPool = databasePoolConnect();

// Store uploaded files in memory
const storage = multer.memoryStorage();

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

app.post("/spotify/connect", spotifyAuth);
app.get("/spotify/trending", spotifyGlobalTopHits);
app.get("/spotify/recommendations", spotifyGenreRecommendation);
app.get("/youtube/music/search", youtubeMusic);
app.post("/post/create", insertPost); // {userId:'ACC0000002', message:'Look at this song! <3', url:'https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR'} 
app.post("/posts", getPostWithFollowing); // {userId:'ACC0000002', sort:'ASC'}
app.post("/post/update", updatePostMessage); // {postId:'PST000003', message:'Soooooooooo addicted to this song!'}
app.post("/post/like/update", updatePostLike); // {postId:'PST000003', noOfLikes:123}
app.delete("/post", deletePostMessage); // {postId:'ACC0000002'}


app.get("/user/genre", getUserGenre);
app.post("/user/genre", insertUserGenre);
app.post("/user/post", getAllUserPost);
app.post("/user/resetpassword", sendEmail);
app.post("/user/update", updateUser);

app.get("/user/post/count", getPostCount);
app.get("/user/following/count", getUserFollowingCount);
app.get("/user/follower/count", getUserFollowersCount);
app.get("/user/following", getUserConnections);

app.post("/user/uploadpic", upload.single('image'), uploadPhoto);

app.use("/auth", router); // auth routes
app.use("/api/notifications", notificationsRoutes);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
})

// Doing cleanup upon code exit
//process.on('exit', () => {
//    console.log("exit Quitting Application.")
//    databaseDisconnect()
//    process.exit();
//});

process.on('SIGINT', () => {
    console.log("sigint Quitting Application.")
    databaseDisconnect()
    process.exit();
});
