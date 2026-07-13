// Creates and configures Express application that contains middleware, routes, request handling and response handling.

import express from "express";
import cors from "cors";
import pool from "./db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// Create Express app
const app = express();

// Middleware
app.use(cors()); // allows frontend to communicate with backend across different origins
app.use(express.json()); // parses incoming frontend json to obj for req access like req.body

// API routes
app.use("/api/categories", categoryRoutes); // localhost:5000/api/categories
app.use("/api/transactions", transactionRoutes); // localhost:5000/api/transactions

// Root route http://localhost:5000/
app.get("/", (req, res) => {
  res.send("Finance Management API is running");
});

// Database connection test route localhost:5000/db-test
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // retrieve current date and time obj

    res.status(200).json({
      message: "Database connected successfully",
      databaseTime: result.rows[0],
    });
  } catch (error) {
    // HTTP 500 Internal Server Error
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

export default app;
