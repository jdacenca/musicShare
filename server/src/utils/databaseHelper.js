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
    const { userId, sort } = req.body;
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
        return res.status(500).send("Internal Server Error");
    } 
}

// Sample call -- let r = await insertPost('ACC0000002', 'Look at this song! <3', 'https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR')
// Returns the number of inserted value to indicate success else, null
export const insertPost = async function(req, res) {

    const { userId, message, musicUrl } = req.body;
    try {
        //generate select query
        let query = util.format('INSERT INTO post (message, music_url, no_of_likes, user_id) VALUES (\'%s\', \'%s\', %d, \'%s\')', message, musicUrl, 0, userId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return res.status(201).send({"affectedRows": result.rowCount});   
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// Sample call -- let r = await updatePostMessage('PST000003', 'Soooooooooo addicted to this song!')
// Returns the number of inserted value to indicate success else, null
export const updatePostMessage = async function(req, res) {
    const { postId, message } = req.body;
    
    try {
        //generate select query
        let query = util.format('UPDATE post SET message=\'%s\', updated_timestamp=NOW() where id=\'%s\'', message, postId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// Sample call -- let r = await updatePostLike('PST000003', 123)
// Returns the number of inserted value to indicate success else, null
export const updatePostLike = async function(req, res) {

    const { postId, noOfLikes } = req.body;
    try {
        //generate select query
        let query = util.format('UPDATE post SET no_of_likes=%d, updated_timestamp=NOW() where id=\'%s\'', noOfLikes, postId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}


// Not yet done
export const deletePostMessage = async function(req, res) {

    const { postId } = req.body;
    try {
        //generate select query
        let query = util.format('UPDATE post SET is_deleted=\'true\'  where id=\'%s\'', postId);
        let result = await client.query({
                //owMode: 'array',
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

//------------------------------------------------------------
// USER
//------------------------------------------------------------
// Sample call -- let r = await getPost('ACC0000002', 'ASC');
export const getUserGenre = async function(req, res) {

    const { userId } = req.body;
    try {
        //generate select query
        let query = 'SELECT * from user_music_genre where user_id=\'' + userId + "\'";
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return res.status(200).send(result.rows);
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

export const insertUserGenre = async function(req, res) {

    const { userId, genreId } = req.body;
    try {
        let query = util.format('INSERT INTO user_music_genre (user_id, music_genre_id) VALUES (\'%s\', %d)', userId, genreId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

export const deleteUserGenre = async function(req, res) {

    const { userId, genreId } = req.body;
    try {
        let query = util.format('DELETE FROM user_music_genre where user_id=\'%s\' and music_genre_id=%d', userId, genreId);
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

export const updateUser = async function(req, res) {

    const { name, username, status, userId } = req.body;
    try {
        // Check first if the username is already taken
        //generate select query
        let checkUsernameQuery = 'SELECT * from users where username=\'' + username + "\'";
        let isFound = await client.query({
                //rowMode: 'array',
                text: checkUsernameQuery
            });

        if (isFound.rowCount == 0 && (isFound.rows[0].id === userId )) {
            let query = util.format('UPDATE users SET name=\'%s\', username=\'%s\', status=\'%s\'  where id=\'%s\'', name, username, status, userId);
            let result = await client.query({
                    //rowMode: 'array',
                    text: query
                });
            return res.status(200).send({"affectedRows": result.rowCount}); 
        } else {
            return res.status(400).send("Username already taken!"); 
        }
        
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}
