import dotenv from "dotenv";

// Load test database environment variables before test files import the app.
dotenv.config({
  path: ".env.test",
  override: true, // test values replace any existing environment variables with the same names
});

// console.log("Test database:", process.env.DATABASE_URL);
