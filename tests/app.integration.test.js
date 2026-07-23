import request from "supertest"; // Supertest send a simulated HTTP request to Express app
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import app from "../app.js";
import pool from "../db.js";

// Root test suite
describe("General API endpoints", () => {
  it("returns a success message from the root endpoint", async () => {
    // give Supertest Express app to send simulated GET request
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Finance Management API is running");
  });
});

// Category test suite for /api/categories
describe("Category API", () => {
  // 1st database integration test case
  it("returns all transaction categories", async () => {
    // supertest sends GET /api/categories request passes through application flow
    // express app => category route => getCategories controller => postgresql test database => json response
    const response = await request(app).get("/api/categories");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // check that its array because controller sends res.status(200).json(result.rows);
    expect(response.body.length).toBe(8); // 8 categories
    expect(response.body[0]).toEqual({
      id: 1,
      name: "Food",
    }); // to confirm that ORDER BY id ASC works correctly
  });
});

// Transaction setup and tests suite for /api/transactions
describe("Transaction API", () => {
  // Runs before each transaction test case
  beforeEach(async () => {
    // Remove all existing rows in transactions and reset the generated transaction id SERIAL to 1
    await pool.query("TRUNCATE TABLE transactions RESTART IDENTITY");

    // Insert known transactions so every test starts with the same data.
    await pool.query(`
        INSERT INTO transactions
          (title, amount, type, category_id, transaction_date)
        VALUES
          (
            'Monthly Salary',
            3000.00,
            'income',
            (SELECT id FROM categories WHERE name = 'Salary'),
            '2026-07-01'
          ),
          (
            'Lunch',
            12.50,
            'expense',
            (SELECT id FROM categories WHERE name = 'Food'),
            '2026-07-02'
          ),
          (
            'Bus Fare',
            2.00,
            'expense',
            (SELECT id FROM categories WHERE name = 'Transport'),
            '2026-07-03'
          )
      `);
  });

  // GET all transactions test case
  it("returns all transactions", async () => {
    // supertest sends GET /api/transactions request passes through application flow
    // express app => transaction route => getTransactions controller => pool.query test database => json response
    const response = await request(app).get("/api/transactions");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true); // checks endpoint returns json array
    expect(response.body.length).toBe(3);
    expect(response.body[0]).toMatchObject({
      id: 3,
      title: "Bus Fare",
      amount: "2.00",
      type: "expense",
      category: "Transport",
      transaction_date: "2026-07-03",
    }); // controller orders results using ORDER BY t.transaction_date DESC, t.id DESC
  });

  // type-filter test
  it("filters transactions by type", async () => {
    const response = await request(app).get("/api/transactions?type=expense");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);

    expect(
      response.body.every((transaction) => transaction.type === "expense"),
    ).toBe(true);
  });

  // category-filter test
  it("filters transactions by category", async () => {
    const response = await request(app).get("/api/transactions?category=Food");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);

    expect(response.body[0]).toMatchObject({
      title: "Lunch",
      type: "expense",
      category: "Food",
    });
  });

  // combined-filter test
  it("filters transactions by type and category", async () => {
    const response = await request(app).get(
      "/api/transactions?type=expense&category=Food",
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);

    expect(response.body[0]).toMatchObject({
      title: "Lunch",
      amount: "12.50",
      type: "expense",
      category: "Food",
    });
  });

  // test GET /api/transactions/:id to retrieve one existing transaction
  // and return 404 when the transaction does not exist
  it("returns one transaction by ID", async () => {
    const response = await request(app).get("/api/transactions/2");

    expect(response.status).toBe(200);

    expect(response.body).toMatchObject({
      id: 2,
      title: "Lunch",
      amount: "12.50",
      type: "expense",
      category_id: 1,
      category: "Food",
      transaction_date: "2026-07-02",
    });
  });

  it("returns 404 when transaction does not exist", async () => {
    const response = await request(app).get("/api/transactions/999");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "Transaction not found",
    });
  });

  // test POST /api/transactions
  it("creates a new transaction", async () => {
    const newTransaction = {
      title: "Freelance Payment",
      amount: 500,
      type: "income",
      category_id: 4,
      transaction_date: "2026-07-04",
    };

    const response = await request(app)
      .post("/api/transactions")
      .send(newTransaction);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Transaction created successfully");

    expect(response.body.transaction).toMatchObject({
      id: 4,
      title: "Freelance Payment",
      amount: "500.00",
      type: "income",
      category_id: 4,
    });

    // confirm it was really inserted into PostgreSQL
    // the row actually exists in the database
    const databaseResult = await pool.query(
      "SELECT * FROM transactions WHERE id = $1",
      [response.body.transaction.id],
    );

    expect(databaseResult.rows.length).toBe(1);
    expect(databaseResult.rows[0]).toMatchObject({
      title: "Freelance Payment",
      amount: "500.00",
      type: "income",
      category_id: 4,
    });
  });

  // Test invalid data for validation case
  it("returns 400 when creating a transaction with an invalid amount", async () => {
    const response = await request(app).post("/api/transactions").send({
      title: "Invalid Transaction",
      amount: 0,
      type: "expense",
      category_id: 1,
      transaction_date: "2026-07-04",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: "Amount must be greater than 0",
    });
  });
});

// Runs once after every test inside suite has finished
afterAll(async () => {
  await pool.end(); // closes all PostgreSQl connections in the pool to exit vitest
});
