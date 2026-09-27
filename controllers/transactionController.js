// controllers/transactionController.js
// Handles HTTP requests and responses for transaction operations.

import {
  findTransactions,
  findTransactionById,
  insertTransaction,
  updateTransactionById,
  deleteTransactionById,
  calculateTransactionSummary,
} from "../models/transactionModel.js";

/*
GET /api/transactions
GET /api/transactions?type=expense
GET /api/transactions?category=Food
GET /api/transactions?type=expense&category=Food
*/
export const getTransactions = async (req, res) => {
  try {
    const { type, category } = req.query;

    const transactions = await findTransactions(type, category); // result.rows

    res.status(200).json(transactions);
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

    const transaction = await findTransactionById(id); // result.rows[0]

    // Handles the missing transaction,  result.rows = []
    if (!transaction) {
      // Requested Resource NOT FOUND
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transaction",
      error: error.message,
    });
  }
};

// POST /api/transactions
// POST => validateTransaction => createTransaction => insertTransaction => PostgreSQL
export const createTransaction = async (req, res) => {
  try {
    const transaction = await insertTransaction(req.body); // result.rows[0]

    // HTTP 201 Created
    res.status(201).json({
      message: "Transaction created successfully",
      transaction: transaction,
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

    const transaction = await updateTransactionById(id, req.body); // result.rows[0]

    // Requested Resource NOT FOUND
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: transaction,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update transaction",
      error: error.message,
    });
  }
};

// DELETE /api/transactions/:id
// Controller obtains ID => deleteTransactionById(id) => Model executes DELETE => Model returns deleted row => Controller checks whether row exists => 200 or 404
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await deleteTransactionById(id); // result.rows[0]

    // Requested Resource NOT FOUND
    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: transaction,
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
    const summary = await calculateTransactionSummary(); // result.rows[0]

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transaction summary",
      error: error.message,
    });
  }
};
