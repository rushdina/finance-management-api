import express from "express";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/", getTransactions); // GET http://localhost:5000/api/transactions
router.get("/:id", getTransactionById); // GET http://localhost:5000/api/transactions/1
router.post("/", createTransaction); // POST http://localhost:5000/api/transactions

export default router;
