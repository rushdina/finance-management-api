// Handles category database query.

import pool from "../db.js";

// Send SQL query to PostgreSQL
// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    // retrieves category records object from PostgreSQL
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");

    res.status(200).json(result.rows); // sends category data as JSON response to frontend
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
