'use strict';

import axios from 'axios';
import { authToken } from './spotifyAuth.js';

export const spotifyGlobalTopHits = async function(req, res) {
    let globalHitsId = process.env.SPOTIFY_GLOBAL_HITS_PID;
    let playlistURL = process.env.SPOTIFY_PLAYLIST_URL;
    let url = playlistURL + globalHitsId;

    const headers = {
        headers: {
            'Authorization': 'Bearer ' + authToken
        }
    }

    axios.get(url, headers)
    .then((response) => {
        if (response.status === 200) {
            return res.status(200).send(response.data);
        } else {
            return res.status(401).send("Access Denied");
        }
        
    })
    .catch((error) => {
        console.log("Error getting the trending hits. " +  error);
        return res.status(500).send("Internal Server Error");
    }) 
    
};
