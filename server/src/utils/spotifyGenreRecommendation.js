'use strict';

import axios from 'axios';
import { authToken } from './spotifyAuth.js';

export const spotifyGenreRecommendation = async function(req, res) {
    let url = process.env.SPOTIFY_RECOMMENDATION_URL;
    const { genre } = req.query;

    const headers = {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }/* ,
        params: {
            seed_genres: encodeURIComponent(genre)
        } */
    } 

    url = url + "?q=genre:" + encodeURIComponent(genre) + "&type=track";


    const r = await axios.get(url, headers)
    .then((response) => {
        if (response.status === 200) {
            return res.status(200).send(response.data);
        } else {
            return res.status(401).send("Access Denied");
        }
        
    })
    .catch((error) => {
        console.log("Error getting the tracks with specific genre. " +  error);
        return res.status(500).send("Internal Server Error");
    })
    
};
