// controllers/categoryController.js
// Handles HTTP requests and responses for category operations.

import { findAllCategories } from "../models/categoryModel.js";

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    const categories = await findAllCategories(); // model returns result.rows

    res.status(200).json(categories); // express sends category data as JSON to frontend over HTTP
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

/*
categoryController => findAllCategories() => categoryModel => pool.query() => PostgreSQL
*/
