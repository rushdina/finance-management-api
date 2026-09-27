// middleware/rateLimiter.js
import { rateLimit } from "express-rate-limit";

// Limits repeated requests to the API to reduce API abuse
// and application-level resource exhaustion.
export const createApiLimiter = (limit = 100) =>
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window in milliseconds
    limit, // maximum requests allowed per client within the window
    standardHeaders: "draft-8", // adds standardized rate-limit information to HTTP responses
    legacyHeaders: false, // disables older X-RateLimit-* style headers
    message: {
      message: "Too many requests. Please try again later.", // HTTP 429 Too Many Requests
    },
  });

// Production/default API limiter: 100 requests per 15 minutes
const apiLimiter = createApiLimiter();

export default apiLimiter;
