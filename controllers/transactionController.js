import pool from "../db.js";

// GET /api/transactions
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

// POST /api/transactions
export const createTransaction = async (req, res) => {
  try {
    const { title, amount, type, category_id, transaction_date } = req.body;

    const result = await pool.query(
      `
      INSERT INTO transactions (title, amount, type, category_id, transaction_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [title, amount, type, category_id, transaction_date],
    );
    console.log(result);

    // Created
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create transaction",
      error: error.message,
    });
  }
};
