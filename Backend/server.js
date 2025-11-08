// require('dotenv').config();
// const express = require('express');
// const mysql = require('mysql2/promise'); // ✅ promise version
// const bcrypt = require('bcryptjs');
// const cors = require('cors');
// const jwt = require('jsonwebtoken'); // ✅ JWT import

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Database connection
// let db;
// (async () => {
//   try {
//     // Trim removes hidden spaces or newlines
//     const dbUrl = process.env.DATABASE_URL?.trim();

//     if (!dbUrl) {
//       throw new Error("DATABASE_URL is missing or invalid");
//     }

//     db = await mysql.createConnection(dbUrl);
//     await db.query('SELECT 1');
//     console.log('✅ Connected to MySQL database');
//   } catch (err) {
//     console.error('❌ Database connection failed:', err.message);
//   }
// })();


// // Secret key for JWT
// const JWT_SECRET = process.env.JWT_SECRET; // you can later move this to .env

// // Routes
// app.get('/', (req, res) => res.send('✅ Backend is running!'));

// app.get('/test', (req, res) => res.send('🔥 Test route reached successfully!'));

// // Register
// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password)
//     return res.status(400).json({ message: 'Username and password required' });

//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
//     db.query(sql, [username, hashedPassword], (err) => {
//       if (err) {
//         console.error('❌ Error inserting user:', err);
//         return res.status(500).json({ message: 'Error registering user' });
//       }
//       res.json({ message: '✅ User registered successfully!' });
//     });
//   } catch (error) {
//     console.error('❌ Hashing error:', error);
//     res.status(500).json({ message: 'Error processing registration' });
//   }
// });

// // Login
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   const sql = 'SELECT * FROM users WHERE username = ?';
//   db.query(sql, [username], async (err, results) => {
//     if (err || results.length === 0)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     console.log("Login attempt:", username);
//     console.log("Query results:", results);

//     const user = results[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     // ✅ Generate JWT Token
//     const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

//     res.json({ message: '✅ Login successful!', token });
//     console.log(token)

//   });
// });

// // Middleware to verify token
// function verifyToken(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return res.status(403).json({ message: 'No token provided' });

//   const token = authHeader.split(' ')[1]; // 'Bearer <token>'
//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return res.status(401).json({ message: 'Invalid or expired token' });
//     req.user = decoded; // attach user info to request
//     next();

//   });
// }

// // ✅ Protected Route
// app.get('/dashboard', verifyToken, (req, res) => {
//   res.json({
//     message: `🎉 This is your protected dashboard.`,
//     user: req.user
//   });
// });

// // Start server
// const port = process.env.PORT || 5000;
// app.get("/ping", (req, res) => {
//   res.send("pong");
// });
// app.listen(port, "0.0.0.0", () => console.log(`🚀 Server running on port ${port}`));

// // app.listen(5000, () => console.log('🚀 Server running on port 5000'));

// ✅ Load environment variables intelligently
require("dotenv").config();


// Check if DATABASE_URL loaded
console.log("Loaded DATABASE_URL:", process.env.DATABASE_URL);

const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


// Function to connect to the database
async function connectDB() {
  try {
    let pool;

    if (process.env.DATABASE_URL) {
      // ✅ Parse DATABASE_URL if available
      const url = new URL(process.env.DATABASE_URL);
      pool = mysql.createPool({
  host: 'yamabiko.proxy.rlwy.net',
  user: 'root',
  password: 'UCswshGlwaLQkZyLwhlMisEBNqPNZHSL',
  database: 'railway',
  port: 8080,
});

    } else {
      // ✅ Fallback to individual DB variables
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }

    await pool.query('SELECT 1');
    console.log('✅ Connected to MySQL database');
    return pool;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return null;
  }
}

// Start server
(async () => {
  const db = await connectDB();
  if (!db) {
    console.error('❌ Failed to initialize database connection.');
    process.exit(1);
  }

  app.get('/', (req, res) => {
    res.send('Msendoo Children Academy backend is running 🚀');
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();

