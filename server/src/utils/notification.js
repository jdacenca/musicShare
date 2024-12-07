import express from "express";
import { pool } from "./authRoutes.js";

const router = express.Router();

// Fetch unseen notifications for a specific user
router.get("/", async (req, res) => {
  const { userId, viewed } = req.query;

  try {
    const query = `
    SELECT n.*, p.message, p.music_url, u.name, u.username, u.status, u.profile_pic_url
    FROM notifications n
    JOIN post p ON n.post_id = p.id
    JOIN users u ON u.id = p.user_id
    WHERE n.user_id = $1 AND n.viewed = $2
    ORDER BY n.created_at DESC
  `;
    const values = viewed !== undefined ? [userId, viewed] : [userId];
    const result = await pool.query(query, values);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// Mark notifications as viewed
router.put("/view", async (req, res) => {
  const { notificationIds } = req.body;

    // Input validation
    if (!notificationIds || !Array.isArray(notificationIds) || notificationIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid input: 'notificationIds' must be a non-empty array.",
      });
    }

  try {
    // Validate if the notifications exist
    const result = await pool.query(
      `SELECT id FROM notifications WHERE id = ANY($1)`,
      [notificationIds]
    );

    const existingIds = result.rows.map((row) => row.id);

    // Find invalid IDs (those not present in the database)
    const invalidIds = notificationIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(404).json({
        success: false,
        message: "Some notifications were not found.",
        invalidIds,
      });
    }

    // Update only existing IDs
    await pool.query(
      `UPDATE notifications SET viewed = TRUE WHERE id = ANY($1)`,
      [existingIds]
    );

    res.status(200).json({
      success: true,
      updatedIds: existingIds,
    });
  } catch (error) {
    console.error("Error marking notifications as viewed:", error);
    res.status(500).json({ success: false, error: "Failed to update notifications." });
  }
});

// Create a new post and notifications for all users
router.post("/create", async (req, res) => {
  const { userId, message, url } = req.body;

  try {
    // Insert the post into the database
    const postResult = await pool.query(
      `INSERT INTO post (user_id, message, music_url) VALUES ($1, $2, $3) RETURNING id`,
      [userId, message, url]
    );
    const postId = postResult.rows[0].id;

    // Fetch all users except the post creator
    const usersResult = await pool.query(`SELECT id FROM users WHERE id != $1`, [userId]);
    const users = usersResult.rows;

    // Create notifications for each user\
    const title = "New Post Notification";
    const notifications = users.map((user) =>
    pool.query(
      `INSERT INTO notifications (user_id, post_id, title, viewed)
       VALUES ($1, $2, $3, FALSE)`,
      [user.id, postId, title]
    )
  );

    await Promise.all(notifications);

    res.status(201).json({ success: true, message: "Post created and notifications sent." });
  } catch (error) {
    console.error("Error creating post or notifications:", error);
    res.status(500).json({ error: "Failed to create post and notifications." });
  }
});

export default router;