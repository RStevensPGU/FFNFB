require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../src')));

// SQL Server config
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Route: Homepage (check-in)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

// Route: Registration page
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/register.html'));
});

// Route: Thank-you page
app.get('/thankyou.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/thankyou.html'));
});

// Route: Visitor check-in
app.post('/checkin', async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: "Phone number required." });

  try {
    await sql.connect(config);

    const checkVisitor = await sql.query`
      SELECT TOP 1 * FROM Visitors WHERE PhoneNumber = ${phone}
    `;

    if (checkVisitor.recordset.length === 0) {
      return res.json({
        success: false,
        status: "NotFound",
        message: "Visitor not found. Please register first."
      });
    }

    const visitor = checkVisitor.recordset[0];
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const recentCheckIn = await sql.query`
      SELECT TOP 1 * FROM CheckIns
      WHERE VisitorID = ${visitor.VisitorID} AND CheckInTime > ${sevenDaysAgo}
      ORDER BY CheckInTime DESC
    `;

    if (recentCheckIn.recordset.length > 0) {
      const lastCheckInTime = new Date(recentCheckIn.recordset[0].CheckInTime);
      const daysPassed = Math.floor((now - lastCheckInTime) / (1000 * 60 * 60 * 24));
      const daysLeft = Math.max(0, 7 - daysPassed);

      return res.json({
        success: false,
        status: "TooSoon",
        daysLeft: daysLeft
      });
    }

    await sql.query`
      INSERT INTO CheckIns (VisitorID, CheckInTime)
      VALUES (${visitor.VisitorID}, ${now})
    `;

    res.json({
      success: true,
      status: "CheckedIn",
      name: visitor.FullName
    });
  } catch (err) {
    console.error("❌ Error during check-in:", err);
    res.status(500).json({
      success: false,
      status: "ServerError",
      message: "Server error during check-in."
    });
  }
});

// Route: New visitor registration
app.post('/register', async (req, res) => {
  const { name, phone } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: "Name and phone number are required." });
  }

  try {
    await sql.connect(config);

    const existing = await sql.query`
      SELECT * FROM Visitors WHERE PhoneNumber = ${phone}
    `;

    if (existing.recordset.length > 0) {
      return res.json({ success: false, message: "This phone number is already registered. Please check in instead." });
    }

    const insertResult = await sql.query`
      INSERT INTO Visitors (FullName, PhoneNumber)
      OUTPUT INSERTED.VisitorID
      VALUES (${name}, ${phone})
    `;

    const newVisitorID = insertResult.recordset[0].VisitorID;

    await sql.query`
      INSERT INTO CheckIns (VisitorID, CheckInTime)
      VALUES (${newVisitorID}, ${new Date()})
    `;

    res.json({ success: true, name: name });
  } catch (err) {
    console.error("❌ Error during registration:", err);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 API running at http://localhost:${PORT}`);
});
