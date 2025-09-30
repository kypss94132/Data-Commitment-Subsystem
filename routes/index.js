// MySQL connection for all routes
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'disel-editor-db.mysql.database.azure.com',
  user: 'standarduser',                
  password: 'Password123',     
  database: 'parser',
  ssl: {
    rejectUnauthorized: true // SSL is required by Azure
  }
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
