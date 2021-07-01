const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'AttackOnRoot',
    database: 'employees'
});

connection.connect();

module.exports = connection;