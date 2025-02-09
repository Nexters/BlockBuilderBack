const mysql = require("mysql2/promise");

require("dotenv").config();

const pool = mysql.createPool({
  connectionLimit: process.env.DB_CONN_LIMIT || 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  charset: "utf8mb4",
});

module.exports = pool;
