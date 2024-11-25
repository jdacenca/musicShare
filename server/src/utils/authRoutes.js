const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();
const router = express.Router();

// PostgreSQL database connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test the database connection
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((error) => console.error("Error connecting to PostgreSQL:", error));

// Register Route
router.post("/register", async (req, res) => {
  const { username, password, email, name, date_of_birth } = req.body;

  try {
    // Validate required fields
    if (!username || !password || !email || !name || !date_of_birth) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Generate a unique ID for the user
    const generatedId = `ACC${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const query = `
      INSERT INTO users (id, username, password, name, date_of_birth, email, created_timestamp) 
      VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP) RETURNING id`;
    const values = [generatedId, username, hashedPassword, name, date_of_birth, email];
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
    const isPasswordValid = await bcrypt.compare(password, user.password);
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
      },
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Error logging in" });
  }
});

// Protected Route Middleware
function authenticateToken(req, res, next) {
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

module.exports = router;
module.exports.authenticateToken = authenticateToken;
