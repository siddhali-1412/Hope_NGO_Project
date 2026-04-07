const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes

// Auth
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  
  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
    const token = jwt.sign({ id: result.insertId, email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ token, user: { id: result.insertId, name, email } });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) return res.status(400).json({ error: 'User not found' });
    
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/google-login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user exists
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    let user;
    if (rows.length === 0) {
      // Create user with a random password
      const hashed = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
      const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashed]);
      user = { id: result.insertId, name, email };
    } else {
      user = rows[0];
    }
    
    const jwtToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });
    res.json({ token: jwtToken, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Invalid Google token' });
  }
});

// NGOs
app.get('/api/ngos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM ngos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ngos', async (req, res) => {
  const { name, mission, registration_number, location } = req.body;
  if (!name || !registration_number) return res.status(400).json({ error: 'Name and Registration Number are required.' });
  
  try {
    const [result] = await db.query('INSERT INTO ngos (name, mission, registration_number, location) VALUES (?, ?, ?, ?)', [name, mission, registration_number, location]);
    res.json({ id: result.insertId, name, mission, registration_number, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Volunteers
app.get('/api/volunteers', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM volunteers');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/volunteers', async (req, res) => {
  const { name, email, skills, location } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and Email are required.' });
  
  try {
    const [result] = await db.query('INSERT INTO volunteers (name, email, skills, location) VALUES (?, ?, ?, ?)', [name, email, skills, location]);
    res.json({ id: result.insertId, name, email, skills, location });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Donations
app.get('/api/donations', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM donations ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/donations', async (req, res) => {
  const { amount, donor_name, ngo_id, date } = req.body;
  if (!amount) return res.status(400).json({ error: 'Amount is required.' });
  
  try {
    const [result] = await db.query('INSERT INTO donations (amount, donor_name, ngo_id, date) VALUES (?, ?, ?, ?)', [amount, donor_name, ngo_id, date || new Date().toISOString()]);
    res.json({ id: result.insertId, amount, donor_name, ngo_id, date });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Events
app.get('/api/events', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM events');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/events', async (req, res) => {
  const { title, date, location, ngo_id } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required.' });
  
  try {
    const [result] = await db.query('INSERT INTO events (title, date, location, ngo_id) VALUES (?, ?, ?, ?)', [title, date, location, ngo_id]);
    res.json({ id: result.insertId, title, date, location, ngo_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`NGO Platform Backend listening on port ${port}`);
});
