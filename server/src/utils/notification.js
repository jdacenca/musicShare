import express from "express";
import { pool } from "./authRoutes.js";

const router = express.Router();

// Fetch unseen notifications for a specific user
router.get("/", async (req, res) => {
  const { userId, viewed } = req.query;

  console.log("Incoming Request Query:", req.query); // Log query parameters

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  try {
    const viewedCondition = viewed !== undefined ? "AND n.viewed = $2" : "";
    const query = `
    SELECT 
    n.id AS notification_id,
    n.created_at AS notification_time,
    n.title AS notification_title,
    p.message AS post_message,
    p.music_url,
    u.username AS user_name
    FROM notifications n
    JOIN post p ON n.post_id = p.id
    JOIN users u ON p.user_id = u.id
    WHERE n.user_id = $1 AND n.viewed = $2
    ORDER BY n.created_at DESC;
    `;

    const values = viewed !== undefined
      ? [userId, viewed === "true"]
      : [userId];

    console.log("Query:", query); // Log the query
    console.log("Values:", values); // Log the values

    const result = await pool.query(query, values);
    console.log("Query Result:", result.rows); // Log the result
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
});


//Mark notifications as viewed
router.put("/view", async (req, res) => {
  const { notificationIds } = req.body;

  if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Invalid input: 'notificationIds' must be a non-empty array.",
    });
  }

  try {
    const query = `UPDATE notifications SET viewed = TRUE WHERE id = ANY($1)`;
    const result = await pool.query(query, [notificationIds]);
    res.status(200).json({ success: true, updatedIds: notificationIds });
  } catch (error) {
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

    await Promise.all(notifications.Query); // Wait for all notifications to be inserted
    console.log("Notifications created successfully.");
  } catch (error) {
    console.error("Error creating notifications:", error);
    throw error; 
  }
};

export default router;