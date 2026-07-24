import { beforeEach, describe, expect, it, vi } from "vitest";
import { validateTransaction } from "../middleware/validateTransaction.js";

describe("validateTransaction middleware", () => {
  let req;
  let res;
  let next;

  // create mock because express is not running on test
  beforeEach(() => {
    req = {
      body: {
        title: "Lunch",
        amount: 12.5,
        type: "expense",
        category_id: 1,
        transaction_date: "2026-07-01",
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    next = vi.fn();
  });

  // Test a valid transaction
  it("calls next when the transaction data is valid", () => {
    validateTransaction(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  // Test a missing title
  it("returns 400 when a required field is missing", () => {
    req.body.title = "";

    validateTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "All fields are required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Test an invalid amount
  it("returns 400 when the amount is not greater than zero", () => {
    req.body.amount = 0;

    validateTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Amount must be greater than 0",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Test an invalid transaction type
  it("returns 400 when the transaction type is invalid", () => {
    req.body.type = "transfer";

    validateTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Type must be either 'income' or 'expense'",
    });
    expect(next).not.toHaveBeenCalled();
  });

  // Test a future date
  it("returns 400 when the transaction date is in the future", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    req.body.transaction_date = tomorrow.toISOString().split("T")[0];

    validateTransaction(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Transaction date cannot be in the future",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
