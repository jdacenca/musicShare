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
        let query = `INSERT INTO post (message, music_url, no_of_likes, user_id) VALUES ($1, $2, $3, $4) RETURNING id`;
        let result = await client.query(query, [message, musicUrl, 0, userId]);
        return res.status(200).send(result.rows[0]);   
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
        let query = `UPDATE post SET message=$1, updated_timestamp=NOW() where id=$2`;
        let result = await client.query(query, [message, postId]);
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


// Does a soft delete on the post, and returns the number of affected rows.
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
        
        console.log(isFound.rows[0].id)
        if (isFound.rowCount == 0 || (isFound.rows[0].id === userId )) {
            let query = `UPDATE users SET name=$1, username=$2, status=$3  where id=$4`;
            let result = await client.query(query, [name, username, status, userId]);

            return res.status(200).send({"affectedRows": result.rowCount}); 
        } else {
            return res.status(400).send("Username already taken!"); 
        }
        
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

export const getUserConnections = async function(req, res) {

    const { userId } = req.body;
    try {
        //generate select query
        let query = 'SELECT following_id, name from user_connection ucon inner join users uacc on ucon.following_id = uacc.id where ucon.user_id=\'' + userId + "\'";
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