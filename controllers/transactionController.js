import pool from "../db.js";

export const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT
            t.id,
            t.title,
            t.amount,
            t.type,
            c.name AS category,
            t.transaction_date,
            t.created_at
        FROM transactions AS t
        INNER JOIN categories AS c
        ON t.category_id = c.id
        ORDER BY t.id ASC
        `);

    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};
