'use strict';

import axios from 'axios';

export let authToken = "";

export const spotifyAuth = async function(req, res) {
    let clientID = process.env.SPOTIFY_CLIENT_ID;
    let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    let url = 'https://accounts.spotify.com/api/token';

    console.log(clientID);

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
    .then((response) => {
        if (response.status === 200) {
            authToken = response.data["access_token"];
            return res.status(200).send(response.data);
        } else {
            console.log("Access Denied.");
            return res.status(401).send("Access Denied");
        }
        
    })
    .catch((error) => {
        console.log("Error getting the authorization token. " +  error);
        return res.status(500).send("Internal Server Error");
    }) 
    
};

export const spotifyAuthFunc = async function() {
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
    .then((response) => {
        if (response.status === 200) {
            authToken = response.data["access_token"];
            console.log("Successful: " + authToken);
            return authToken;
        } else {
            console.log("Access Denied.");
        }
        
    })
    .catch((error) => {
        console.log("Error getting the authorization token. " +  error);
    }) 
    
};
