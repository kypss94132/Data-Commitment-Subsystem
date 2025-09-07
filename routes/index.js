// MySQL connection for all routes
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',                
  password: 'kypss94132',     
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
