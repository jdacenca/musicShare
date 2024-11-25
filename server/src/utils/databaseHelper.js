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
export const getPost = async function(userId, sort) {

    try {
        //generate select query
        let query = 'SELECT * from post where user_id=\'' + userId + "\' ORDER BY created_timestamp " + sort;
        let result = await client.query({
                rowMode: 'array',
                text: query
            });
        console.log(result)
        return result.rows;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}

// Sample call -- let r = await insertPost('ACC0000002', 'Look at this song! <3', 'https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR')
// Returns the number of inserted value to indicate success else, null
export const insertPost = async function(userId, message, musicUrl) {

    try {
        //generate select query
        let query = util.format('INSERT INTO post (message, music_url, no_of_likes, user_id) VALUES (\'%s\', \'%s\', %d, \'%s\')', message, musicUrl, 0, userId);
        let result = await client.query({
                rowMode: 'array',
                text: query
            });
        console.log(result)
        return result.rowCount;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}

// Sample call -- let r = await updatePostMessage('PST000003', 'Soooooooooo addicted to this song!')
// Returns the number of inserted value to indicate success else, null
export const updatePostMessage = async function(postId, message) {

    try {
        //generate select query
        let query = util.format('UPDATE post SET message=\'%s\', updated_timestamp=NOW() where id=\'%s\'', message, postId);
        console.log(query)
        let result = await client.query({
                rowMode: 'array',
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
export const updatePostLike = async function(postId, noOfLikes) {

    try {
        //generate select query
        let query = util.format('UPDATE post SET no_of_likes=%d, updated_timestamp=NOW() where id=\'%s\'', noOfLikes, postId);
        console.log(query)
        let result = await client.query({
                rowMode: 'array',
                text: query
            });
        return result.rowCount;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}


// Not yet done
export const deletePostMessage = async function(postId) {

    try {
        //generate select query
        let query = util.format('UPDATE post SET message=\'%s\', updated_timestamp=NOW() where id=\'%s\'', message, postId);
        console.log(query)
        let result = await client.query({
                rowMode: 'array',
                text: query
            });
        return result.rowCount;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
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
                rowMode: 'array',
                text: query
            });
        console.log(result)
        return result.rows;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}
