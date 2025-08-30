// MySQL connection for all routes
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',                // ← keep as-is or move to env vars
  password: 'kypss94132',      // ← keep as-is or move to env vars
  database: 'parser',
});

// Establish connection to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);
  }
  console.log('Connected to MySQL');
});

module.exports = connection;
