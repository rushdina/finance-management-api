/**
 * Custom middleware runs before the controller.
 * Checks request body before POST/PUT controller runs.
 * e.g POST request -> validateTransaction -> All checks pass -> next() -> createTransaction()
 * if invalid, stop request and return error
 */

export const validateTransaction = (req, res, next) => {
  const { title, amount, type, category_id, transaction_date } = req.body;

  // HTTP 400 Bad Request: web server cannot process client's request
  // Check required fields exist
  if (
    !title?.trim() ||
    amount === undefined ||
    !type ||
    category_id === undefined ||
    !transaction_date
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Check amount > 0
  if (Number(amount) <= 0) {
    return res.status(400).json({
      message: "Amount must be greater than 0",
    });
  }

  // Check type is valid
  if (type !== "income" && type !== "expense") {
    return res.status(400).json({
      message: "Type must be either 'income' or 'expense'",
    });
  }

  // Check date selected is valid
  const today = new Date().toISOString().split("T")[0];
  if (transaction_date > today) {
    return res.status(400).json({
      message: "Transaction date cannot be in the future",
    });
  }

  // All validations passed, execute the next middleware/controller
  next();
};
