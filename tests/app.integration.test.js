import request from "supertest"; // Supertest send a simulated HTTP request to Express app
import { afterAll, describe, expect, it } from "vitest";
import app from "../app.js";
import pool from "../db.js";

describe("Finance Management API", () => {
  it("returns a success message from the root endpoint", async () => {
    // give Supertest Express app to send simulated GET request
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Finance Management API is running");
  });

  // 1st database integration test
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

  // Runs once after every test inside suite has finished
  afterAll(async () => {
    await pool.end(); // closes all PostgreSQl connections in the pool to exit vitest
  });
});
