'use strict';

import axios from 'axios';
import crypto from 'crypto';

const generateRandomString = (length) => {
    return crypto.randomBytes(60).toString('hex').slice(0, length);
}


export const spotifyAuth = async function(req, res) {
    let clientID = process.env.SPOTIFY_CLIENT_ID;
    let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    let url = 'https://accounts.spotify.com/api/token';

    const headers = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientID + ':' + clientSecret).toString('base64'))
        }
    }

    const body = {
        "grant_type": "client_credentials"
    }

    axios.post(url, body, headers)
    .then(response => console.log(
        response.data))
    .catch(error => {
        console.log("catch")
    }) 

    return res.status(200).send("OKAY");
};
