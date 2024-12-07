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

        // Get all connections
        //generate select query
        let queryUserConnections = 'SELECT following_id from user_connection ucon inner join users uacc on ucon.following_id = uacc.id where ucon.user_id=\'' + userId + "\'";
        let resultConnections = await client.query({
                //rowMode: 'array',
                text: queryUserConnections
            });
        
        let users = []
        users.push('\'' + userId + '\'')
        await resultConnections.rows.forEach((user) => users.push('\'' + user.following_id + '\''));
        //generate select query
        let query = 'SELECT p.*, u.name, u.username, u.status, u.profile_pic_url from post p inner join users u on p.user_id=u.id where p.user_id in (' + users.join(',') + ") and p.is_deleted='false' ORDER BY p.created_timestamp " + sort;

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
        const query = `INSERT INTO post (message, music_url, no_of_likes, user_id) VALUES ($1, $2, $3, $4) RETURNING id`;
        const postResult = await client.query(query, [message, musicUrl, 0, userId]);
        const postId = postResult.rows[0].id;  

        // Create notifications for all users except the creator
        await createNotificationsForPost(postId, userId);

        return res.status(200).send({"success": true, postId});
    } catch (err) {
        console.log("Error creating post or notifications: " + err);
        return res.status(500).send("Failed to create post or notifications.");
    } 
}

// Create notifications for all users except the post creator
export const createNotificationsForPost = async function (postId, userId) {
    try {
      // Fetch all users except the post creator
      const usersResult = await client.query(`SELECT id FROM users WHERE id != $1`, [userId]);
      const users = usersResult.rows;
  
      if (users.length === 0) {
        console.log("No users found to notify.");
        return; // No notifications to create
      }
  
      // Define a default notification title
      const title = "New Post Notification";
  
      // Insert notifications for each user
      const notifications = users.map((user) =>
        client.query(
          `INSERT INTO notifications (user_id, post_id, title, viewed)
           VALUES ($1, $2, $3, FALSE)`,
          [user.id, postId, title]
        )
      );
  
      await Promise.all(notifications); // Wait for all notifications to be inserted
      console.log("Notifications created successfully.");
    } catch (error) {
      console.error("Error creating notifications:", error);
      throw error; 
    }
  };
  
  // Fetch notifications for a specific user
export const getNotifications = async function(req, res) {
    const { userId, viewed } = req.query;

    if (!userId) {
        return res.status(400).send({ error: "User ID is required." });
    }

    try {
        const viewedCondition = viewed !== undefined ? "AND n.viewed = $2" : "";
        const query = `
        SELECT 
            n.id AS notification_id,
            n.created_at AS notification_time,
            p.message AS post_message,
            p.music_url,
            u.username AS user_name
        FROM notifications n
        JOIN post p ON n.post_id = p.id
        JOIN users u ON p.user_id = u.id
        WHERE n.user_id = $1 ${viewedCondition}
        ORDER BY n.created_at DESC;
        `;

        const values = viewed !== undefined
            ? [userId, viewed === "true"]
            : [userId];

        const result = await client.query(query, values);

        return res.status(200).send(result.rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).send("Failed to fetch notifications.");
    }
};
  
  // Mark notifications as viewed
  export const markNotificationsAsViewed = async function (req, res) {
    const { notificationIds } = req.body;
  
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).send({
        success: false,
        error: "Invalid input: 'notificationIds' must be a non-empty array.",
      });
    }
  
    try {
      const query = `UPDATE notifications SET viewed = TRUE WHERE id = ANY($1)`;
      const result = await client.query(query, [notificationIds]);
  
      return res.status(200).send({ success: true, updatedIds: notificationIds });
    } catch (error) {
      console.error("Error marking notifications as viewed:", error);
      return res.status(500).send("Failed to update notifications.");
    }
  };
  

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

    const { name, username, status, userId, profilePicURL } = req.body;
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
            let query = `UPDATE users SET name=$1, username=$2, status=$3, profile_pic_url=$4  where id=$5`;
            let result = await client.query(query, [name, username, status, profilePicURL, userId]);

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
        let query = 'SELECT ucon.following_id, uacc.name, uacc.profile_pic_url from user_connection ucon inner join users uacc on ucon.following_id = uacc.id where ucon.user_id=\'' + userId + "\'";
        let result = await client.query({
                //rowMode: 'array',
                text: query
            });

        console.log(result.rows)
        return res.status(200).send(result.rows);
    } catch (err) {
        console.log("Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}