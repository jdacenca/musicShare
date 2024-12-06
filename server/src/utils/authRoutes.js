'use strict';

import express from "express";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import pg from 'pg';

const { Pool } = pg;

export const router = express.Router();

let pool = undefined;

// PostgreSQL database connection
export const databasePoolConnect = async function() {
  pool = new Pool({
    user: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
  });

  // Test the database connection
  pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Error connecting to PostgreSQL:", error));
}

// Register Route
router.post("/register", async (req, res) => {
  const { username, password, email, name, date_of_birth } = req.body;
  try {
    // Validate required fields
    if (!username || !password || !email || !name || !date_of_birth) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if username or email is already registered
    const checkQuery = `SELECT * FROM users WHERE username = $1 OR email = $2`;
    const checkResult = await pool.query(checkQuery, [username, email]);
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: "Username or email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert the new user into the database
    const query = `
      INSERT INTO users (username, password, name, date_of_birth, email, created_timestamp) 
      VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING id`;
    const values = [username, hashedPassword, name, date_of_birth, email];
    const result = await pool.query(query, values);

    res.status(201).json({ message: "User registered successfully", userId: result.rows[0].id });
  } catch (error) {
    console.error("Error during registration:", error.message);
    res.status(500).json({ error: "Error registering user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    // Find the user in the database
    const query = `SELECT * FROM users WHERE username = $1`;
    const result = await pool.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        fullname: user.name,
        status: user.status,
        birthday: user.date_of_birth,
        profilePic: user.profile_pic_url
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Error logging in" });
  }
});

export const generateResetToken = async function(email) {
  try {
      // Find the user in the database
      const query = `SELECT * FROM users WHERE email = $1`;
      const result = await pool.query(query, [email]);
      const user = result.rows[0];

    // Generate a JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return token;
  } catch (err) {
      console.log("Error in running query: " + err);
      return null;
  } 
}


router.get("/resetpassword/:token", async (req, res) => {
    
    try {
      const { token } = req.params;
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified; // Attach the decoded token to the request
      return res.status(200).send(verified);
    
    } catch (err) {
      console.log(err)
      res.status(403).json({ error: "Invalid email link" });
    }
});

// Change Password Route
router.post("/change-password", async (req, res) => {
  const { id, newPassword } = req.body;

  try {
    // Validate required fields
    if (!id || !newPassword) {
      return res.status(400).json({ error: "Id and new password are required" });
    }

    // Find the user by email
    const checkQuery = `SELECT * FROM users WHERE id = $1`;
    const checkResult = await pool.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return res.status(400).json({ error: "Id not registered" });
    }

    // Hash the new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update the user's password in the database
    const updateQuery = `UPDATE users SET password = $1 WHERE id = $2`;
    await pool.query(updateQuery, [hashedPassword, id]);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error during password change:", error.message);
    res.status(500).json({ error: "Error changing password" });
  }
});

// Protected Route Middleware
export const authenticateToken = async function(req, res) {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Access denied, no token provided" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach the decoded token to the request
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
}

// Protected Route Example
router.get("/api/dashboard", authenticateToken, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.username}!` });
});

//module.exports = router;
//module.exports.authenticateToken = authenticateToken;
