// Create Node.js Express backend server

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json()); // converts incoming json from frontend to obj for req access like req.body

app.use("/api/categories", categoryRoutes); // localhost:5000/api/categories
app.use("/api/transactions", transactionRoutes); // localhost:5000/api/transactions

app.get("/", (req, res) => {
  res.send("Personal Finance Management API is running");
});

// localhost:5000/db-test
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()"); // retrieve current date and time obj
    console.log(result);

    res.json({
      message: "Database connected successfully",
      databaseTime: result.rows[0],
    });
  } catch (error) {
    // Server error
    res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
