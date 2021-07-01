const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    port: '3006',
    user: 'root',
    password: 'Attackonroot',
    database: 'employees'
});

connection.connect();

module.exports = connection;