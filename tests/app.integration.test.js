import request from "supertest"; // Supertest send a simulated HTTP request to Express app
import { describe, expect, it } from "vitest";
import app from "../app.js";

describe("Finance Management API", () => {
  it("returns a success message from the root endpoint", async () => {
    // give Supertest Express app to send simulated GET request
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Finance Management API is running");
  });
});
