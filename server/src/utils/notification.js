import express from "express";
import { pool } from "./authRoutes.js";

const router = express.Router();

// Fetch unseen notifications for a specific user
router.get("/", async (req, res) => {
  // User ID and "viewed" parameter from the query
  const { userId, viewed } = req.query;

  //log for debug
  console.log("Incoming Request Query:", req.query); // Log query parameters

  // Check if user ID is provided if not return error
  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
   // Construct the SQL query conditionally based on the "viewed" parameter.
    const viewedCondition = viewed !== undefined ? "AND n.viewed = $2" : "";
    // Sql query to fetch unseen notifications for a specific user
    const query = `
    SELECT 
    n.post_id,
    n.id AS notification_id,
    n.created_at AS notification_time,
    n.title AS notification_title,
    p.message AS post_message,
    p.music_url,
    u.username AS user_name,
    u.name, u.status, u.profile_pic_url
    FROM notifications n
    JOIN post p ON n.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE n.user_id = $1 AND n.viewed = $2
    ORDER BY n.created_at DESC;
    `;

    // set the values for the query parameters
    // if viewed is provided, set it to true
    const values = viewed !== undefined
      ? [userId, viewed === "true"]
      : [userId];

    // log for debugging 
    console.log("Query:", query); // Debug sql query 
    console.log("Values:", values); // Debug query parameters 

    const result = await pool.query(query, values);
    console.log("Query Result:", result.rows); // Debug query result
    res.status(200).json(result.rows);
  } catch (error) {
    // log for debugging
    console.error("Error fetching notifications:", error);
    // send error response 500 internal server error
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});


//Mark notifications as viewed
router.put("/view", async (req, res) => {
  const { notificationIds } = req.body;

  // validate notificationIds array must be non-empty
  if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
    // return an error if response is invalid 
    return res.status(400).json({
      success: false,
      error: "Invalid input: 'notificationIds' must be a non-empty array.",
    });
  }

  try {
    // sql query to mark notifications as viewed for specific user ids
    const query = `UPDATE notifications SET viewed = TRUE WHERE id = ANY($1)`;
    const result = await pool.query(query, [notificationIds]);
    // return success response if update is successful with updated id 
    res.status(200).json({ success: true, updatedIds: notificationIds });
  } catch (error) {
    // log error for debugging and return response if update fails 
    console.error("Error marking notifications as viewed:", error);
    res.status(500).json({ error: "Failed to update notifications." });
  }
});

// Create a new post and notifications for all users
export const createNotificationsForPost = async (postId, userId) => {
  try {
    // Fetch all users except the post creator
    const usersResult = await pool.query(`SELECT id FROM users WHERE id != $1`, [userId]);
    const users = usersResult.rows;

    // Check if any users were found to notify
    if (users.length === 0) {
      console.log("No users found to notify.");
      return;
    }

    // Define a default notification title
    const title = "New Post Notification";

    // Insert notifications for each user
    const notificationsQuery = users.map((user) =>
      pool.query(
        `INSERT INTO notifications (user_id, post_id, title, viewed)
         VALUES ($1, $2, $3, FALSE)`,
        [user.id, postId, title]
      )
    );

    // Wait for all notifications to be inserted
    await Promise.all(notifications.Query); 
    console.log("Notifications created successfully.");
  } catch (error) {
    // Log error for debugging and throw error 
    console.error("Error creating notifications:", error);
    throw error; 
  }
};

export default router;