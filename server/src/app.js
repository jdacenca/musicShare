import dotenv from "dotenv";
import express from "express";

import { spotifyAuth, spotifyAuthFunc } from "./utils/spotifyAuth.js";
import { spotifyGlobalTopHits } from "./utils/spotifyGlobalTopHits.js";
import { spotifyGenreRecommendation } from "./utils/spotifyGenreRecommendation.js";
import { youtubeMusic } from "./utils/youTubeSearchMusicCategory.js";
import { databaseConnect, databaseDisconnect, getPost, insertPost, updatePostMessage, updatePostLike, deletePostMessage } from "./utils/databaseHelper.js";
import { sendEmail } from "./utils/sendEmail.js";
import { router, databasePoolConnect, authenticateToken } from "./utils/authRoutes.js";
import { startSocketIOServer } from './utils/notification.js'

import process from 'node:process';
import cors from "cors";

dotenv.config({ path: "../.env" });

const app = express();
//startSocketIOServer(app)
//const router = Router();

if (process.env.ENABLE_CORS === 'true') {
  app.use(cors());
}

app.use(express.json());
const port = process.env.PORT || 3000;

// connect to database
let client = databaseConnect();
let clientPool = databasePoolConnect();

app.post("/spotify/connect", spotifyAuth);
app.get("/spotify/trending", spotifyGlobalTopHits);
app.get("/spotify/recommendations", spotifyGenreRecommendation);
app.get("/youtube/music/search", youtubeMusic);
app.post("/post/create", insertPost); // {userId:'ACC0000002', message:'Look at this song! <3', url:'https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR'} 
app.post("/posts", getPost); // {userId:'ACC0000002', sort:'ASC'}
app.post("/post/update", updatePostMessage); // {postId:'PST000003', message:'Soooooooooo addicted to this song!'}
app.post("/post/like/update", updatePostLike); // {postId:'PST000003', noOfLikes:123}
app.delete("/post", deletePostMessage); // {postId:'ACC0000002'}
app.post("/user/resetpassword", sendEmail);

app.use("/auth", router); // auth routes

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
