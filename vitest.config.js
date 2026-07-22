import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./tests/setup.js"], // vitest run this before importing and executing test files
    fileParallelism: false, // not to run separate test files simultaneously
  },
});

/*
1. Load .env.test
2. Import app.js
3. Import db.js
4. Create pool using test DATABASE_URL
5. Run tests
*/
