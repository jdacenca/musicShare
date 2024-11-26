import dotenv from "dotenv";
import express, { Router } from "express";

import { spotifyAuth } from "./utils/spotifyAuth.js";
import { spotifyGlobalTopHits } from "./utils/spotifyGlobalTopHits.js";
import { spotifyGenreRecommendation } from "./utils/spotifyGenreRecommendation.js";
import { youtubeMusic } from "./utils/youTubeSearchMusicCategory.js";

import { databaseConnect, databaseDisconnect } from "./utils/databaseHelper.js";
import { sendEmail } from "./utils/sendEmail.js";
import { authRoutes } from "./utils/authRoutes.js";

import process from 'node:process';
import cors from "cors";

dotenv.config({ path: "../.env" });

const app = express();
const router = Router();

if (process.env.ENABLE_CORS === 'true') {
  app.use(cors());
}

app.use(express.json());
const port = process.env.PORT || 3000;

// connect to database
let client = databaseConnect();

router.post("/spotify/connect", spotifyAuth);
router.get("/spotify/trending", spotifyGlobalTopHits);
router.get("/spotify/recommendations", spotifyGenreRecommendation);
router.get("/youtube/music/search", youtubeMusic);

app.use("/api/", router)
app.use("/auth", authRoutes); // auth routes

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
