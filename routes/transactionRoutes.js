// Defines transaction API routes.

import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
} from "../controllers/transactionController.js";
import { validateTransaction } from "../middleware/validateTransaction.js";

const router = express.Router();

// routes in order
router.get("/", getTransactions); // GET http://localhost:5000/api/transactions (supports query parameter filtering)
router.get("/summary", getTransactionSummary); // GET http://localhost:5000/api/transactions/summary
router.get("/:id", getTransactionById); // GET http://localhost:5000/api/transactions/1
router.post("/", validateTransaction, createTransaction); // POST http://localhost:5000/api/transactions
router.put("/:id", validateTransaction, updateTransaction); // PUT http://localhost:5000/api/transactions/1
router.delete("/:id", deleteTransaction); // DELETE http://localhost:5000/api/transactions/1

export default router;
