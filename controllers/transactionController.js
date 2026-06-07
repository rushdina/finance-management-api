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

// Retrieve one transaction using ID, GET /api/transactions/:id
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
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
      WHERE t.id = $1
    `,
      [id],
    );
    console.log(result);

    // Requested Resource NOT FOUND
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transaction",
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

// PUT /api/transactions/:id
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, amount, type, category_id, transaction_date } = req.body;

    const result = await pool.query(
      `
      UPDATE transactions
      SET
        title = $1,
        amount = $2,
        type = $3,
        category_id = $4,
        transaction_date = $5
      WHERE id = $6
      RETURNING *
    `,
      [title, amount, type, category_id, transaction_date, id],
    );
    console.log(result);

    // Requested Resource NOT FOUND
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};
