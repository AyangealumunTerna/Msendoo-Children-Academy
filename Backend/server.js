// ✅ Load environment variables
require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// 🧩 Connect to MySQL
let db;
(async () => {
  try {
    const dbUrl = process.env.DATABASE_URL?.trim();

    if (!dbUrl) throw new Error("DATABASE_URL is missing or invalid");

    const url = new URL(dbUrl);
    db = await mysql.createPool({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.replace("/", ""),
      port: url.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    await db.query("SELECT 1");
    console.log("✅ Connected to MySQL database");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// 🌍 Base route
app.get("/", (req, res) => {
  res.send("✅ Msendoo Children Academy backend is running!");
});

// 🧪 Test route
app.get("/test", (req, res) => {
  res.send("🔥 Test route reached successfully!");
});

// 🧾 Register route
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
    await db.query(sql, [username, hashedPassword]);
    res.json({ message: "✅ User registered successfully!" });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ message: "Error registering user" });
  }
});

// 🔐 Login route
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "✅ Login successful!", token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Error logging in" });
  }
});

// 🛡️ Token verification middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

// 🧠 Protected route
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: `🎉 Welcome to your protected dashboard.`,
    user: req.user,
  });
});

// 🩺 Health check
app.get("/ping", (req, res) => {
  res.send("pong");
});

// 🚀 Start server (Railway requires 0.0.0.0)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
