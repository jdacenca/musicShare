'use strict';

import axios from 'axios';

export const youtubeMusic = async function(req, res) {
    const { q } = req.query;
    let youtubeKey = process.env.YOUTUBE_API_KEY;
    let youtubeBaseURL = process.env.YOUTUBE_BASE_API_URL;
    let url = youtubeBaseURL + '/search?key=' + youtubeKey;
    if (q != undefined) {
        url = url + "&q=" + encodeURIComponent(q);
    }
    url = url + '&part=snippet&type=video&videoCategoryId=10&channelType=any&eventType=none&videoEmbeddable=true&maxResults=10'    

    axios.get(url)
    .then((response) => {
        if (response.status === 200) {
            return res.status(200).send(response.data);
        } else {
            return res.status(401).send("Access Denied");
        }
        
    })
    .catch((error) => {
        console.log("Error getting the authorization token. " +  error);
        return res.status(500).send("Internal Server Error");
    }) 
    
};
