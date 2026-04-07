const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'ngo_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDB() {
  try {
    // Attempt to connect without database, create db if doesn't exist.
    const rootPool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || ''
    });
    
    await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'ngo_db'}\``);
    await rootPool.end();

    console.log('Connected to the MySQL database.');

    // Create NGOs table
    await pool.query(`CREATE TABLE IF NOT EXISTS ngos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      mission TEXT,
      registration_number VARCHAR(255),
      location VARCHAR(255)
    )`);

    // Create Volunteers table
    await pool.query(`CREATE TABLE IF NOT EXISTS volunteers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      skills TEXT,
      location VARCHAR(255)
    )`);

    // Create Donations table
    await pool.query(`CREATE TABLE IF NOT EXISTS donations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      amount DECIMAL(10, 2) NOT NULL,
      donor_name VARCHAR(255),
      ngo_id INT,
      date VARCHAR(255),
      FOREIGN KEY(ngo_id) REFERENCES ngos(id)
    )`);

    // Create Events table
    await pool.query(`CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      date VARCHAR(255),
      location VARCHAR(255),
      ngo_id INT,
      FOREIGN KEY(ngo_id) REFERENCES ngos(id)
    )`);

    // Create Users table for Auth
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    )`);

    // Seed Initial Mock Data (India localized)
    const [rows] = await pool.query('SELECT count(*) as count FROM ngos');
    if (rows[0].count === 0) {
      // Seed NGOs
      await pool.query('INSERT INTO ngos (name, mission, registration_number, location) VALUES (?, ?, ?, ?)', 
        ['Green Earth India', 'Planting trees and preserving wildlife across India', 'REG-12093', 'Mumbai, MH']);
      await pool.query('INSERT INTO ngos (name, mission, registration_number, location) VALUES (?, ?, ?, ?)', 
        ['Hope for All', 'Providing meals to the underserved', 'REG-67890', 'Bengaluru, KA']);

      // Seed Events
      await pool.query('INSERT INTO events (title, date, location, ngo_id) VALUES (?, ?, ?, ?)', 
        ['Marine Drive Cleanup', '2026-05-10', 'Mumbai', 1]);
      await pool.query('INSERT INTO events (title, date, location, ngo_id) VALUES (?, ?, ?, ?)', 
        ['Indiranagar Food Drive', '2026-05-15', 'Bengaluru', 2]);

      // Seed Donations
      await pool.query('INSERT INTO donations (amount, donor_name, ngo_id, date) VALUES (?, ?, ?, ?)', 
        [5000.00, 'Arjun M.', 1, '2026-04-01']);
      await pool.query('INSERT INTO donations (amount, donor_name, ngo_id, date) VALUES (?, ?, ?, ?)', 
        [15000.00, 'Anonymous', 2, '2026-04-01']);
      await pool.query('INSERT INTO donations (amount, donor_name, ngo_id, date) VALUES (?, ?, ?, ?)', 
        [2000.00, 'Priya S.', 2, '2026-04-02']);

      console.log('Indian Mock data seeded!');
    }
  } catch (err) {
    console.error('Error initializing MySQL database:', err.message);
  }
}

initializeDB();

module.exports = pool;
