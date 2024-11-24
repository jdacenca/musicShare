import dotenv from "dotenv";
import express from "express";

import { spotifyAuth } from "./utils/spotifyAuth.js";
import { spotifyGlobalTopHits } from "./utils/spotifyGlobalTopHits.js";
import { spotifyGenreRecommendation } from "./utils/spotifyGenreRecommendation.js";
import { youtubeMusic } from "./utils/youTubeSearchMusicCategory.js";

import { databaseConnect, getPost } from "./utils/databaseHelper.js";

import cors from "cors";

dotenv.config({ path: "../.env" });

const app = express();

if (process.env.ENABLE_CORS === 'true') {
  app.use(cors());
}

app.use(express.json());
const port = process.env.PORT || 3000;

// connect to database
let client = databaseConnect();

app.post("/spotify/connect", spotifyAuth);
app.get("/spotify/trending", spotifyGlobalTopHits);
app.get("/spotify/recommendations", spotifyGenreRecommendation);

app.get("/youtube/music/search", youtubeMusic);



app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
