import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import { spotifyAuth } from "./utils/spotifyAuth.js";
import { spotifyGlobalTopHits } from "./utils/spotifyGlobalTopHits.js";
import { spotifyGenreRecommendation } from "./utils/spotifyGenreRecommendation.js";
import cors from "cors";

dotenv.config({ path: "../.env" });

const app = express();

if (process.env.ENABLE_CORS === 'true') {
  app.use(cors());
}

app.use(express.json());
const port = process.env.PORT || 3000;

app.post("/spotify/connect", spotifyAuth);
app.get("/spotify/trending", spotifyGlobalTopHits);
app.get("/spotify/recommendations", spotifyGenreRecommendation);

app.listen(port, () => {
  console.log("Server is running on port: " + port);
});
