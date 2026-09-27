// tests/rateLimiter.test.js
import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApiLimiter } from "../middleware/rateLimiter.js";

describe("API rate limiter", () => {
  it("returns 429 when the request limit is exceeded", async () => {
    const app = express();

    // Use a small limit so the test does not need to send 101 requests.
    const testLimiter = createApiLimiter(2);

    app.use(testLimiter);

    app.get("/test", (req, res) => {
      res.status(200).json({
        message: "Request successful",
      });
    });

    const firstResponse = await request(app).get("/test");
    const secondResponse = await request(app).get("/test");
    const thirdResponse = await request(app).get("/test");

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);

    expect(thirdResponse.status).toBe(429);
    expect(thirdResponse.body).toEqual({
      message: "Too many requests. Please try again later.",
    });
  });
});
