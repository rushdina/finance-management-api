// Handles category database SQL query.

import pool from "../db.js";

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    /**
     * pool.query() sends SQL query to PostgreSQL
     * pg library converts database rows into JS object
     * PostgreSQL returns data rows to nodejs as JS object result
     */
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    /*
    result = {
      rows: [
        { id: 1, name: "Food" },
        { id: 2, name: "Transport" }
      ]
    }*/

    res.status(200).json(result.rows); // express sends category data as JSON to frontend over HTTP
    /*
    [
      { "id": 1, "name": "Food"},
      { "id": 2, "name": "Transport"}
    ]*/
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
