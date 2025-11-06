const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // ✅ JWT import

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'users_db'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ MySQL Connected');
  }
});

// Secret key for JWT
const JWT_SECRET = 'your_secret_key_here'; // you can later move this to .env

// Routes
app.get('/', (req, res) => res.send('✅ Backend is running!'));

app.get('/test', (req, res) => res.send('🔥 Test route reached successfully!'));

// Register
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err) => {
      if (err) {
        console.error('❌ Error inserting user:', err);
        return res.status(500).json({ message: 'Error registering user' });
      }
      res.json({ message: '✅ User registered successfully!' });
    });
  } catch (error) {
    console.error('❌ Hashing error:', error);
    res.status(500).json({ message: 'Error processing registration' });
  }
});

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const sql = 'SELECT * FROM users WHERE username = ?';
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0)
      return res.status(401).json({ message: 'Invalid credentials' });

    console.log("Login attempt:", username);
    console.log("Query results:", results);

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // ✅ Generate JWT Token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ message: '✅ Login successful!', token });
    console.log(token)

  });
});

// Middleware to verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // 'Bearer <token>'
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid or expired token' });
    req.user = decoded; // attach user info to request
    next();

  });
}

// ✅ Protected Route
app.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: `🎉 This is your protected dashboard.`,
    user: req.user
  });
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));

// app.listen(5000, () => console.log('🚀 Server running on port 5000'));
