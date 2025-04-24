const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const path = require('path');
const moment = require('moment-timezone');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('src'));

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  }
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'register.html'));
});

app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'thankyou.html'));
});

// Check-in route
app.post('/checkin', async (req, res) => {
  const { phone } = req.body;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT TOP 1 *
      FROM Visitors
      WHERE PhoneNumber = ${phone}
      ORDER BY CreatedAt DESC
    `;

    const now = moment.tz('America/Denver').toDate(); // Mountain Time
    const visitor = result.recordset[0];
    const lastVisit = visitor ? new Date(visitor.CreatedAt) : null;

    if (!visitor) {
      return res.status(404).json({ status: "NotFound" });
    }

    const daysSinceLastVisit = lastVisit ? (now - lastVisit) / (1000 * 60 * 60 * 24) : null;

    if (daysSinceLastVisit !== null && daysSinceLastVisit < 7) {
      const daysRemaining = Math.ceil(7 - daysSinceLastVisit);
      return res.status(200).json({ status: "TooSoon", daysLeft: daysRemaining });
    }

    await sql.query`
      UPDATE Visitors
      SET CreatedAt = ${now}
      WHERE PhoneNumber = ${phone}
    `;

    res.status(200).json({ status: "CheckedIn", name: visitor.FullName });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "Error", message: "An error occurred while checking in." });
  }
});

// Register route
app.post('/register', async (req, res) => {
  const { name, phone } = req.body;

  try {
    await sql.connect(dbConfig);
    const now = moment.tz('America/Denver').toDate(); // Mountain Time
    console.log("Inserting timestamp:", now);
    
    await sql.query`
      INSERT INTO Visitors (FullName, PhoneNumber, CreatedAt)
      VALUES (${name}, ${phone}, ${now})
    `;

    res.json({ success: true, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  }
});

// Admin login route
app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM Users WHERE Username = ${username} AND PasswordHash = ${password}
    `;

    if (result.recordset.length > 0) {
      res.status(200).json({ success: true, message: 'Login successful' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Login failed.');
  }
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'src', 'adminDashboard.html'));
});

// Admin dashboard data route
app.get('/admin/dashboard-data', async (req, res) => { 
  try {
    await sql.connect(dbConfig);

    // Visits Today (based on CreatedAt)
    const visitsTodayResult = await sql.query`
      SELECT COUNT(*) AS count
      FROM Visitors
      WHERE CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE)
    `;

    // New Registrations Today
    const newRegistrationsResult = await sql.query`
      SELECT COUNT(*) AS count
      FROM Visitors
      WHERE CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE)
    `;

    // Visitor Count for Last 7 Days
    const visitsLast7DaysResult = await sql.query`
      SELECT 
        CAST(CreatedAt AS DATE) AS visitDate,
        COUNT(*) AS totalVisits
      FROM Visitors
      WHERE CreatedAt >= DATEADD(DAY, -6, CAST(GETDATE() AS DATE))
      GROUP BY CAST(CreatedAt AS DATE)
      ORDER BY visitDate
    `;

    // Build a complete array for the last 7 days (including zero-visit days)
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const isoDate = date.toISOString().split('T')[0];

      const match = visitsLast7DaysResult.recordset.find(row =>
        row.visitDate.toISOString().split('T')[0] === isoDate
      );

      last7Days.push({
        date: isoDate,
        totalVisits: match ? match.totalVisits : 0
      });
    }

    res.status(200).json({
      visitsToday: visitsTodayResult.recordset[0].count,
      newRegistrations: newRegistrationsResult.recordset[0].count,
      last7Days
    });

  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).send('Failed to fetch dashboard data.');
  }
});

app.get('/search', async (req, res) => {
  const { query } = req.query;  // Get the search term from the query string
  
  try {
    await sql.connect(dbConfig);
    const result = await sql.query`
      SELECT * FROM Visitors
      WHERE FullName LIKE ${'%' + query + '%'} OR PhoneNumber LIKE ${'%' + query + '%'}
    `;
    
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error searching visitors:', err);
    res.status(500).json({ status: "Error", message: "An error occurred while searching for visitors." });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

app.use(express.static(path.join(__dirname, 'src')));