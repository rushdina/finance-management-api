import pool from "../db.js";

/*
GET /api/transactions
GET /api/transactions?type=expense
GET /api/transactions?category=Food
GET /api/transactions?type=expense&category=Food
*/
export const getTransactions = async (req, res) => {
  try {
    const { type, category } = req.query;

    // No filter /api/transactions
    let query = `
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
    `;

    const values = []; // store sql parameter to replace placeholder
    const conditions = []; // store WHERE conditions

    // e.g /api/transactions?type=expense
    if (type) {
      values.push(type);
      conditions.push(`t.type = $${values.length}`);
    }

    // e.g /api/transactions?category=Food
    if (category) {
      values.push(category);
      conditions.push(`c.name = $${values.length}`);
    }

    // e.g /api/transactions?type=expense&category=Food
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // End query with ORDER BY
    query += ` ORDER BY t.id ASC`;

    const result = await pool.query(query, values);

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

// DELETE /api/transactions/:id
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM transactions
      WHERE id = $1
      RETURNING *
    `,
      [id],
    );

    // Requested Resource NOT FOUND
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete transaction",
      error: error.message,
    });
  }
};

// GET /api/transactions/summary
export const getTransactionSummary = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(
          SUM(
            CASE 
              WHEN type = 'income' THEN amount
              ELSE 0
            END
          ),
          0
        ) AS total_income,

        COALESCE(
          SUM(
            CASE 
              WHEN type = 'expense' THEN amount
              ELSE 0
            END
          ),
          0
        ) AS total_expense,

        COALESCE(
          SUM(
            CASE 
              WHEN type = 'income' THEN amount
              ELSE -amount
            END
          ),
          0
        ) AS balance
      FROM transactions
    `);

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transaction summary",
      error: error.message,
    });
  }
};
