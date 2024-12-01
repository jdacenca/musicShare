'use strict';

import pg from 'pg';
import util from  'node:util';
const { Client } = pg;

let client = undefined;

export const databaseConnect = async function() {
    client = new Client({
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        database: process.env.DATABASE_NAME
    })

    await client.connect()

    return client
}

export const databaseDisconnect = async function() {
    client.end();
    console.log("Database disconnected.");
}

//------------------------------------------------------------
// POST
//------------------------------------------------------------
// Sample call -- let r = await getPost('ACC0000002', 'ASC');
export const getPost = async function(req, res) {
    const userId = req.body.userId;
    const sort = req.body.sort;
    if(userId){
        try {
            //generate select query
            let query = 'SELECT * from post where user_id=\'' + userId + "\' and is_deleted='false' ORDER BY created_timestamp " + sort;
            let result = await client.query({
                    //rowMode: 'array',
                    text: query
                });
            return res.status(200).send(result.rows);
        } catch (err) {
            console.log("Error in running query: " + err);
            return res.status(500).send("Error in running query");
        } 
    } {
        return res.status(400).send("Invalid request");
    }
}

// Sample call -- let r = await insertPost('ACC0000002', 'Look at this song! <3', 'https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR')
// Returns the number of inserted value to indicate success else, null
export const insertPost = async function(req, res) {
    const userId = req.body.userId;
    const message = req.body.message;
    const musicUrl = req.body.musicUrl;

    if(userId && message) {
        try {
            //generate select query
            let query = util.format('INSERT INTO post (message, music_url, no_of_likes, user_id) VALUES (\'%s\', \'%s\', %d, \'%s\')', message, musicUrl, 0, userId);
            let result = await client.query({
                    //rowMode: 'array',
                    text: query
                });
            return result.rowCount;
        } catch (err) {
            console.log("Error in running query: " + err);
            return null
        } 
    } else {
        return null
    }
}

// Sample call -- let r = await updatePostMessage('PST000003', 'Soooooooooo addicted to this song!')
// Returns the number of inserted value to indicate success else, null
export const updatePostMessage = async function(req, res) {
    const postId = req.body.postId;
    const message = req.body.message;

    try {
        //generate select query
        let query = util.format('UPDATE post SET message=\'%s\', updated_timestamp=NOW() where id=\'%s\'', message, postId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return result.rowCount;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}

// Sample call -- let r = await updatePostLike('PST000003', 123)
// Returns the number of inserted value to indicate success else, null
export const updatePostLike = async function(req, res) {
    const postId = req.body.postId;
    const noOfLikes = req.body.noOfLikes;
    try {
        //generate select query
        let query = util.format('UPDATE post SET no_of_likes=%d, updated_timestamp=NOW() where id=\'%s\'', noOfLikes, postId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return result.rowCount;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}


// Not yet done
export const deletePostMessage = async function(req, res) {
    const postId = req.body.postId;

    if(postId) {
        try {
            //generate select query
            let query = util.format('UPDATE post SET is_deleted=\'true\'  where id=\'%s\'', postId);
            let result = await client.query({
                    //owMode: 'array',
                    text: query
                });
            return res.status(200).send(result.rowCount);
        } catch (err) {
            console.log("Error in running query: " + err);
            return res.status(500).send("Error in running query");
        } 
    } else {
        return res.status(400).send("Invalid request");
    }

}

//------------------------------------------------------------
// USER
//------------------------------------------------------------
// Sample call -- let r = await getPost('ACC0000002', 'ASC');
export const getUserGenre = async function(userId) {

    try {
        //generate select query
        let query = 'SELECT * from user_music_genre where user_id=\'' + userId + "\'";
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        console.log(result)
        return result.rows;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}

export const insertUserGenre = async function(userId, genreId) {

    try {
        let query = util.format('INSERT INTO user_music_genre (user_id, music_genre_id) VALUES (\'%s\', %d)', userId, genreId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        console.log(result)
        return result.rows;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}

export const deleteUserGenre = async function(userId, genreId) {

    try {
        let query = util.format('DELETE FROM user_music_genre where user_id=\'%s\' and music_genre_id=%d', userId, genreId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        console.log(result)
        return result.rows;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}
