// Connect Node.js Express to PostgreSQL using pg Pool to create database connection.

import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  // user: process.env.DB_USER,
  // host: process.env.DB_HOST,
  // database: process.env.DB_NAME,
  // password: process.env.DB_PASSWORD,
  // port: process.env.DB_PORT,

  connectionString: process.env.DATABASE_URL,

  // Secure Sockets Layer encrypts communication between Express server and PostgreSQL
  // preventing data from being read while it travels across internet
  ssl:
    process.env.NODE_ENV === "production"
      ? // If application is running in production, enable SSL.
        // PostgreSQL database will use encrypted connection.
        // SSL checks whether database's SSL certificate is signed by trusted Certificate Authority (CA)
        { rejectUnauthorized: false } // use ssl encryption but dont reject connection if certificate isnt verified
      : // If running locally (development), disable SSL for local database
        false,
});

export default pool;
