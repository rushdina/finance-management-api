// models/categoryModel.js
// Handles category database SQL query.

import pool from "../db.js";

export const findAllCategories = async () => {
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

  return result.rows;
};
