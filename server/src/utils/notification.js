import { Server } from "socket.io";
import { pool } from "./authRoutes.js";

// Initialize the Express app and Socket.IO server
export const startSocketIOServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Socket.IO logic
  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Fetch unseen notifications for a specific user
    socket.on("fetch_notifications", async (userId) => {
      try {
        const result = await pool.query(
          `SELECT n.*, p.message, p.music_url
           FROM notifications n
           JOIN post p ON n.post_id = p.id
           WHERE n.user_id = $1 AND n.viewed = FALSE
           ORDER BY n.created_at DESC`,
          [userId]
        );
        socket.emit("notifications", result.rows);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    });

    // Mark notifications as viewed
    socket.on("mark_as_viewed", async ({ userId, postId }) => {
      try {
        await pool.query(
          `UPDATE notifications
           SET viewed = TRUE
           WHERE user_id = $1 AND post_id = $2`,
          [userId, postId]
        );
        socket.emit("notification_viewed", { userId, postId });
      } catch (error) {
        console.error("Error marking notification as viewed:", error);
      }
    });

    // Broadcast a new notification to all users
    socket.on("create_post_notification", async (data) => {
      const { userId, postId, title } = data;

      try {
        // Fetch all users except the post creator
        const usersResult = await pool.query(`SELECT id FROM users WHERE id != $1`, [userId]);
        const users = usersResult.rows;

        // Create notifications for each user
        const notifications = users.map((user) =>
          pool.query(
            `INSERT INTO notifications (user_id, post_id, title, viewed)
             VALUES ($1, $2, $3, FALSE)`,
            [user.id, postId, title]
          )
        );

        await Promise.all(notifications);

        // Broadcast the notification to all connected clients
        io.emit("new_post_notification", { postId, title });
      } catch (error) {
        console.error("Error creating notifications:", error);
      }
    });

    // Handle disconnection
    socket.on("disconnect", (reason) => {
      console.log(`Socket.IO: User disconnected with ID: ${socket.id}. Reason: ${reason}`);
    });
  });

  // Debug server-level events
  server.on("error", (err) => {
    console.error("Socket.IO Server Error:", err.message, err.stack);
  });
};