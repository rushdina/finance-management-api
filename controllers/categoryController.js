import pool from "../db.js";

// Send SQL query to PostgreSQL
export const getCategories = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY id ASC"); // retrieves category records object from PostgreSQL
    console.log(result);

    res.status(200).json(result.rows); // sends category data as JSON response to frontend
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};
