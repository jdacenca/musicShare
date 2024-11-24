'use strict';

import pg from 'pg';
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
}


// Sample call -- getPost('ACC0000002', 'ASC');
export const getPost = async function(userId, sort) {

    try {
        //generate select query
        let query = 'SELECT * from post where user_id=\'' + userId + "\' ORDER BY created_timestamp " + sort;
        let result = await client.query({
                rowMode: 'array',
                text: query
            });
        return result.rows;
    } catch (err) {
        console.log("Error in running query: " + err);
        return null
    } 
}