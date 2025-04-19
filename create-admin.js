require('dotenv').config(); // Load environment variables from .env file
const sql = require('mssql');
const bcrypt = require('bcrypt');

const createAdminUser = async () => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin_Password', 10);

    // Establish database connection using the credentials in the .env file
    await sql.connect({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      server: process.env.DB_SERVER,
      database: process.env.DB_DATABASE,
      options: {
        encrypt: true, // Use encryption if required by SQL Server
        trustServerCertificate: true // Disable SSL validation for local environments
      }
    });

    // Check if the admin user already exists
    const result = await sql.query`
      SELECT * FROM Users WHERE Username = 'admin'
    `;

    if (result.recordset.length > 0) {
      console.log('Admin user already exists.');
      return;
    }

    // Insert the admin user into the Users table with a hashed password
    await sql.request()
      .input('username', sql.NVarChar, 'admin')
      .input('passwordHash', sql.NVarChar, hashedPassword)
      .input('role', sql.NVarChar, 'admin')
      .query(`
        INSERT INTO Users (Username, PasswordHash, Role)
        VALUES (@username, @passwordHash, @role)
      `);

    console.log('Admin user created successfully.');
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
  } finally {
    // Close the database connection
    await sql.close();
  }
};

createAdminUser();
