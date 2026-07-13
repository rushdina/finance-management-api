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
});

// Runs once after every test inside suite has finished
afterAll(async () => {
  await pool.end(); // closes all PostgreSQl connections in the pool to exit vitest
});
