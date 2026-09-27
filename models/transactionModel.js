// models/transactionModel.js
// Handles CRUD, filtering, summary, SQL queries.

import pool from "../db.js";

/*
Model responsibilities:
1. Construct database queries
2. Execute SQL queries using the PostgreSQL connection pool
3. Use parameterised queries when user/request values are included
4. Return database data to the controller
*/

// GET all transactions with optional filters
export const findTransactions = async (type, category) => {
  // SELECT with optional filters
  // No filter /api/transactions
  let query = `
      SELECT
        t.id,
        t.title,
        t.amount,
        t.type,
        c.name AS category,
        TO_CHAR(t.transaction_date, 'YYYY-MM-DD') AS transaction_date,
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
  query += ` ORDER BY t.transaction_date DESC, t.id DESC`;

  const result = await pool.query(query, values);

  return result.rows;
};

// GET one transaction by ID
export const findTransactionById = async (id) => {
  // SELECT ... WHERE id = $1
  const result = await pool.query(
    `
      SELECT
        t.id,
        t.title,
        t.amount,
        t.type,
        t.category_id,
        c.name AS category,
        TO_CHAR(t.transaction_date, 'YYYY-MM-DD') AS transaction_date,
        t.created_at
      FROM transactions AS t
      INNER JOIN categories AS c
      ON t.category_id = c.id
      WHERE t.id = $1
    `,
    [id],
  );

  return result.rows[0];
};

// CREATE transaction
export const insertTransaction = async (transactionData) => {
  // INSERT ...
  const { title, amount, type, category_id, transaction_date } =
    transactionData;

  const result = await pool.query(
    `
      INSERT INTO transactions 
        (title, amount, type, category_id, transaction_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [title, amount, type, category_id, transaction_date],
  );
  // console.log(result);

  return result.rows[0];
};

// UPDATE transaction
export const updateTransactionById = async (id, transactionData) => {
  // UPDATE ...
  const { title, amount, type, category_id, transaction_date } =
    transactionData;

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
      RETURNING
        id,
        title,
        amount,
        type,
        category_id,
        TO_CHAR(transaction_date, 'YYYY-MM-DD') AS transaction_date,
        created_at
    `,
    [title, amount, type, category_id, transaction_date, id],
  );
  // console.log(result);

  return result.rows[0];
};

// DELETE transaction
export const deleteTransactionById = async (id) => {
  // DELETE ...
  const result = await pool.query(
    `
      DELETE FROM transactions
      WHERE id = $1
      RETURNING *
    `,
    [id],
  );

  return result.rows[0];
};

// GET transaction summary
export const calculateTransactionSummary = async () => {
  // SELECT SUM / CASE / COALESCE...
  const result = await pool.query(`
      SELECT
        COALESCE(
          SUM(
            CASE 
              WHEN type = 'income' THEN amount
              ELSE 0
            END
          ),
          0.00::numeric
        ) AS total_income,

        COALESCE(
          SUM(
            CASE 
              WHEN type = 'expense' THEN amount
              ELSE 0
            END
          ),
          0.00::numeric
        ) AS total_expense,

        COALESCE(
          SUM(
            CASE 
              WHEN type = 'income' THEN amount
              WHEN type = 'expense' THEN -amount
              ELSE 0
            END
          ),
          0.00::numeric
        ) AS balance
      FROM transactions
    `);

  return result.rows[0];
};
