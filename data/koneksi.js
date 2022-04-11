const mysql = require('mysql2');

const dbName = 'upt_titip';

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: dbName,
});

module.exports = connection;