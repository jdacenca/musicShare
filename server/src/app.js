import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios';
import { spotifyAuth } from './utils/spotifyAuth.js';

dotenv.config({path: '../.env'});

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.post('/spotify/connect', spotifyAuth);

app.listen(port, () => {
    console.log('Server is running on port: ' + port)
});