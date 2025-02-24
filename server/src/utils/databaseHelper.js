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
// This function retrives all the posts not just the one created by the user
// but also the posts created by followed friends.
export const getPostWithFollowing = async function(req, res) {
    const { userId, sort } = req.body;
    try {
        // Generate select query for getting the followed friends
        let queryUserConnections = `SELECT following_id from user_connection ucon 
                                    inner join users uacc on ucon.following_id = uacc.id 
                                    where ucon.user_id='${userId}'`;
        let resultConnections = await client.query({
                text: queryUserConnections
            });
        
        let users = []
        users.push('\'' + userId + '\'')
        await resultConnections.rows.forEach((user) => users.push('\'' + user.following_id + '\''));

        // Generate select query to get the posts
        let query = 'SELECT p.*, u.name, u.username, u.status, u.profile_pic_url from post p inner join users u on p.user_id=u.id where p.user_id in (' + users.join(',') + ") and p.is_deleted='false' ORDER BY p.created_timestamp " + sort;

        let result = await client.query({
                text: query
            });

        return res.status(200).send(result.rows);

    } catch (err) {
        console.log("[getPostWithFollowing] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function gets all the users post
export const getAllUserPost = async function(req, res) {
    const { userId, sort } = req.body;
    try {
        // Generate select query
        let query = "SELECT p.*, u.name, u.username, u.status, u.profile_pic_url from post p inner join users u on p.user_id=u.id where p.user_id='" + userId + "' and p.is_deleted=false ORDER BY p.created_timestamp " + sort;

        console.log(query)
        let result = await client.query({
                text: query
            });
        return res.status(200).send(result.rows);

    } catch (err) {
        console.log("[getAllUserPost] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function retrieves the count of all the user post
export const getPostCount = async function(req, res) {
    const { userId } = req.query;
    try {
        // Generate select query
        let query = `SELECT COUNT(*) from post where user_id=$1 and is_deleted=false`;
        let result = await client.query(query, [userId]);

        return res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log("[getPostCount] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// Sample call -- let r = await insertPost('ACC0000002', 'Look at this song! <3', 'https://open.spotify.com/track/3yfqSUWxFvZELEM4PmlwIR')
// Returns the number of inserted value to indicate success else, null
export const insertPost = async function(req, res) {

    const { userId, message, musicUrl } = req.body;
    try {
        // Generate select query
        const query = `INSERT INTO post (message, music_url, no_of_likes, user_id) VALUES ($1, $2, $3, $4) RETURNING id`;
        const postResult = await client.query(query, [message, musicUrl, 0, userId]);
        const postId = postResult.rows[0].id;  

        // Create notifications for all users except the creator
        await createNotificationsForPost(postId, userId);
        return res.status(200).send({"success": true, postId});

    } catch (err) {
        console.log("[insertPost] Error creating post or notifications: " + err);
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

    // if no user id is provided, return an error
    if (!userId) {
        return res.status(400).send({ error: "User ID is required." });
    }

    // sql query to fetch notifications for a specific user
    // This filters notifications based on whether they have been seen or not
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

        // set the values for the query parameters
        // if viewed is provided, set it to true
        const values = viewed !== undefined
            ? [userId, viewed === "true"]
            : [userId];

        // execute the query using database client
        const result = await client.query(query, values);

        // send result as a json response
        return res.status(200).send(result.rows);
    } catch (error) {
        // if there is an error, log it and return an error response
        console.error("Error fetching notifications:", error);
        return res.status(500).send("Failed to fetch notifications.");
    }
};

export const getDetailsByUsername = async function (req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).send({ error: "username is required." });
  }

  let userResult;
  try {
    userResult = await client.query(
      `
        SELECT 
            u.profile_pic_url AS "profilePic",
            u.status,
            u.name AS fullname,
            u.username,
            u.id as "userId"
        FROM users u
        WHERE u.username = $1
        `,
      [username]
    );
    if (!userResult || userResult.rows.length == 0) {
      return res.status(400).send({ error: "invalid username." });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).send({ error: "unable to fetch user." });
  }

  let postResult;

  try {
    postResult = await client.query(
      `
         SELECT *
         FROM post 
         WHERE is_deleted=\'false\' and user_id = $1
         `,
      [userResult.rows[0].userId]
    );
  } catch (error) {
    console.error("Error fetching posts", error);
  }

  let followingResult;

  try {
    followingResult = await client.query({
      text:
        "SELECT COUNT(*) from user_connection where user_id='" + userResult.rows[0].userId + "'",
    });
  } catch (err) {
    console.log("Error in running query: " + err);
  }

  let followersResult;

  try {
    followersResult = await client.query({
      text:
        "SELECT COUNT(*) from user_connection where following_id='" +
        userResult.rows[0].userId +
        "'",
    });
  } catch (err) {
    console.log("Error in running query: " + err);
  }

  return res.status(200).send({
    user: userResult.rows[0],
    posts: postResult && postResult.rows ? postResult.rows : [],
    followersCount: followersResult?.rows ? followersResult.rows[0].count : 0,
    followingCount: followingResult?.rows ? followingResult.rows[0].count : 0,
  });
};
  
  // Mark notifications as viewed
  export const markNotificationsAsViewed = async function (req, res) {
    const { notificationIds } = req.body;
  
    // validate input data notificationIds must be a non-empty array
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
        // return an error if input data is invalid
      return res.status(400).send({
        success: false,
        error: "Invalid input: 'notificationIds' must be a non-empty array.",
      });
    }
  
    try {
      // sql query to mark notifications as viewed
      const query = `UPDATE notifications SET viewed = TRUE WHERE id = ANY($1)`;
      // execute the query using database client and pass notificationIds as an array
      const result = await client.query(query, [notificationIds]);
  
      // send success response with updated notificationIds
      return res.status(200).send({ success: true, updatedIds: notificationIds });
    } catch (error) {
      // if there is an error, log it and return an error response
      console.error("Error marking notifications as viewed:", error);
      return res.status(500).send("Failed to update notifications.");
    }
  };
  

// Sample call -- let r = await updatePostMessage('PST000003', 'Soooooooooo addicted to this song!')
// Returns the number of inserted value to indicate success else, null
export const updatePostMessage = async function(req, res) {
    const { postId, message } = req.body;
    
    try {
        // Generate select query
        let query = `UPDATE post SET message=$1, updated_timestamp=NOW() AT TIME ZONE 'America/Toronto' where id=$2`;
        let result = await client.query(query, [message, postId]);
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("[updatePostMessage] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// Sample call -- let r = await updatePostLike('PST000003', 123)
// This function insert or update the post like
export const updatePostLike = async function(req, res) {

    const { postId, userId } = req.body;

    if (postId == undefined || userId == undefined) {
        return res.status(400).send({"affectedRows": 0});
    }

    try {
        // Check first if there is already an entry
        let checkEntry = `SELECT is_liked FROM likes where post_id=$1 and user_id=$2`;
        let isFound = await client.query(checkEntry, [postId, userId]);

        let query = ""
        let like = true;

        if (isFound.rowCount > 0) {
            // If there is already an entry update to invert the value
            query = `UPDATE likes SET is_liked=$3  where post_id=$1 and user_id=$2`;
            like = isFound.rows[0].is_liked ? false : true
        } else {
            // if there is no entry, create one
            query = `INSERT INTO likes (post_id, user_id, is_liked) VALUES ($1, $2, $3)`;
        }
        
        let result = await client.query(query, [postId, userId, like]);

        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("[updatePostLike] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function gets all the post like counts
export const getPostLikesCount = async function(req, res) {

    const { postId } = req.body;
    try {
        // Generate a select query
        let checkEntry = `SELECT COUNT(*) FROM likes where post_id=$1 and is_liked=true`;
        let count = await client.query(checkEntry, [postId]);

        if (count.rowCount > 0) {
            return res.status(200).send(count.rows[0]); 
        }

        return res.status(200).send({"count": 0}); 
    } catch (err) {
        console.log("[getPostLikesCount] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function retrieves is the post is liked or not by specific postId and userId
export const getPostUserLike = async function(req, res) {

    const { postId, userId } = req.query;
    try {
        // Check first if there is already an entry
        let checkEntry = `SELECT is_liked FROM likes where post_id=$1 and user_id=$2`;
        let response = await client.query(checkEntry, [postId, userId]);

        if (response.rowCount > 0) {
            return res.status(200).send(response.rows[0].is_liked);
        }

        return res.status(200).send(false); 
    } catch (err) {
        console.log("[getPostUserLike] Error in running query: " + err);
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
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 

    } catch (err) {
        console.log("[deletePostMessage] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

//------------------------------------------------------------
// USER
//------------------------------------------------------------
// Does a soft delete on the post, and returns the number of affected rows.
export const deleteUser = async function(req, res) {

    const { userId } = req.body;
    try {
        //generate select query
        let deleteQuery = `DELETE from user_connection where user_id=$1 or following_id=$2`;
        let deleteResult = await client.query(deleteQuery, [userId, userId]);
        console.log(deleteResult.rowCount);

        //generate select query
        let query = `UPDATE users SET is_deleted=$1 where id=$2`;
        let result = await client.query(query, [true, userId]);
        return res.status(200).send({"affectedRows": result.rowCount}); 

    } catch (err) {
        console.log("[deleteUser] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// Sample call -- let r = await getPost('ACC0000002', 'ASC');
// This function retrieves the users genre of choice
export const getUserGenre = async function(req, res) {

    const { userId } = req.query;
    try {
        //generate select query
        let query = `SELECT music_genre from user_music_genre where user_id=$1`;
        let result = await client.query(query, [userId]);
        return res.status(200).send(result.rows);

    } catch (err) {
        console.log("[getUserGenre] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function is to insert the chosen user genre
export const insertUserGenre = async function(req, res) {

    const { userId, genre } = req.body;
    try {

        // Delete the current genre chosen, this is to ensure that there will be no duplicates
        let delQuery = `DELETE FROM user_music_genre WHERE user_id=$1`;
        let delResult = await client.query(delQuery, [userId]);

        // Generate query to insert values
        const values = [];
        genre.forEach((g) => {
            values.push( "('" + userId + "', '" + g.toLowerCase() + "')")
        })

        let query = "INSERT INTO user_music_genre (user_id, music_genre) VALUES " + values.join(",");
        let result = await client.query({
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 

    } catch (err) {
        console.log("[insertUserGenre] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function delete any user genre
export const deleteUserGenre = async function(req, res) {

    const { userId, genreId } = req.body;
    try {
        let query = util.format('DELETE FROM user_music_genre where user_id=\'%s\' and music_genre_id=%d', userId, genreId);
        let result = await client.query({
                text: query
            });
        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("[deleteUserGenre] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function is for updating the user
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
        
        if (isFound.rowCount == 0 || (isFound.rows[0].id === userId )) {
            let query = `UPDATE users SET name=$1, username=$2, status=$3, profile_pic_url=$4  where id=$5`;
            let result = await client.query(query, [name, username, status, profilePicURL, userId]);

            return res.status(200).send({"affectedRows": result.rowCount}); 
        } else {
            return res.status(400).send("Username already taken!"); 
        }
        
    } catch (err) {
        console.log("[updateUser] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function to do a single user search
export const searchSingleUser = async function(req, res) {

    const { keyword, currentUsername } = req.body;
    try {
        // Generate select query
        // Change the name and username to lower case before equating to prevent any mismatch
        let query = `SELECT id, username, name, date_of_birth, email, status, profile_pic_url from users where (LOWER(name) like $1 or LOWER(username) like $2) and username != $3 LIMIT 5`;
        let result = await client.query(query, ["%" + keyword.toLowerCase() + "%", "%" + keyword.toLowerCase() + "%", currentUsername]);
        
        return res.status(200).send(result.rows); 
        
    } catch (err) {
        console.log("[searchSingleUser] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function is to search for posts
export const searchPost = async function(req, res) {

    const { keyword, userId } = req.body;
    try {
        let queryUserConnections = `SELECT following_id from user_connection ucon inner join users uacc on ucon.following_id = uacc.id where ucon.user_id=$1`;
        let resultConnections = await client.query(queryUserConnections, [userId]);
        
        let users = []
        users.push('\'' + userId + '\'')
        await resultConnections.rows.forEach((user) => users.push('\'' + user.following_id + '\''));

        //generate select query
        let strUsers = users.join(',');
        let query = `SELECT p.id as post_id, p.message, u.name, u.username, u.status, u.profile_pic_url, u.id from post p inner join users u on p.user_id=u.id where p.user_id in (${strUsers}) and LOWER(p.message) like $1 and p.is_deleted=false ORDER BY p.created_timestamp DESC LIMIT 5`;
        let result = await client.query(query, ["%" + keyword.toLowerCase() + "%"]);
        
        return res.status(200).send(result.rows); 
    } catch (err) {
        console.log("[searchPost] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function retrives all the following friends along with their details
export const getUserConnections = async function(req, res) {

    const { userId } = req.query;
    try {
        //generate select query
        let query = `SELECT distinct ucon.following_id, uacc.name, uacc.username, uacc.profile_pic_url from user_connection ucon inner join users uacc on ucon.following_id = uacc.id where ucon.user_id=$1`;
        let result = await client.query(query, [userId]);

        return res.status(200).send(result.rows);
    } catch (err) {
        console.log("[getUserConnections] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function retrieves the user following count
export const getUserFollowingCount = async function(req, res) {

    const { userId } = req.query;
    try {
        //generate select query
        let query = `SELECT COUNT(*) from user_connection where user_id=$1`;
        let result = await client.query(query, [userId]);

        return res.status(200).send(result.rows[0]);

    } catch (err) {
        console.log("[getUserFollowingCount] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This functions retrieves the followers count 
export const getUserFollowersCount = async function(req, res) {

    const { userId } = req.query;
    try {
        //generate select query
        let query = `SELECT COUNT(*) from user_connection where following_id=$1`;
        let result = await client.query(query, [userId]);

        return res.status(200).send(result.rows[0]);
    } catch (err) {
        console.log("[getUserFollowersCount] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

export const getPost = async function (req, res) {
  const { id } = req.query;

  let postResult;

  if (!id) {
    return res.status(200).send("invalid request");
  }

  try {
    postResult = await client.query(
      `
           SELECT p.*, u.name, u.username, u.status, u.profile_pic_url
           FROM post p
           JOIN users u on u.id = p.user_id
           WHERE p.is_deleted=\'false\' and p.id = $1
           `,
      [id]
    );

    return res.status(200).send(postResult.rows[0]);
  } catch (error) {
    console.error("Error fetching posts", error);
    return res.status(500).send("Internal Server Error");
  }
};

// This function creates an entry for the user follow
export const follow = async function (req, res) {
  const { user_id, following_id } = req.body;
  try {

    //to avoid duplicate inserts
    let postResult = await client.query(
        `
             SELECT following_id
             FROM user_connection 
             WHERE following_id = $1 and user_id = $2
             `,
        [following_id, user_id]
      );

    if(postResult?.rows[0]?.following_id){
        return res.status(200).send({ success: true });
    } else {
        await client.query(
            `INSERT into user_connection (following_id, user_id) VALUES ($1, $2) RETURNING id`,
            [following_id, user_id]
          );
    }

   
    return res.status(200).send({ success: true });
  } catch (err) {
    console.log("Error following user: " + err);
    return res.status(500).send("Failed to update.");
  }
};

//This function deletes the entry for the user connection to emulate the unfollow
export const unfollow = async function (req, res) {
    const { user_id, following_id } = req.body;
    try {
  
        await client.query(
            `DELETE FROM user_connection where following_id=$1 and user_id=$2 RETURNING id`,
            [following_id, user_id]
        );
  
     
      return res.status(200).send({ success: true });
    } catch (err) {
      console.log("[unfollow] Error unfollowing user: " + err);
      return res.status(500).send("Failed to update.");
    }
  };

// This function inserts comment
export const insertComment = async function(req, res) {

    const { postId, comment, userId } = req.body;

    try {
        let query = `INSERT INTO comments (post_id, comment, user_id, created_timestamp) VALUES ($1, $2, $3, NOW() AT TIME ZONE 'America/Toronto')`;
        let result = await client.query(query, [postId, comment, userId]);

        return res.status(200).send({"affectedRows": result.rowCount}); 
    } catch (err) {
        console.log("[insertComment] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}

// This function gets the comment from a specific post
export const getComment = async function(req, res) {

    const { postId } = req.query;

    try {
        let query = `SELECT p.id, u.profile_pic_url, u.name, com.comment, com.created_timestamp FROM comments com 
	inner join post p on com.post_id=p.id
	inner join users u on com.user_id=u.id
	where post_id=$1`;
        let result = await client.query(query, [postId]);

        return res.status(200).send(result.rows); 
    } catch (err) {
        console.log("[getComment] Error in running query: " + err);
        return res.status(500).send("Internal Server Error");
    } 
}