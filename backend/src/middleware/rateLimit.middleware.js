const rateLimit = require('express-rate-limit');

// This configuration will limit each IP to 100 requests per 15 minutes.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes in milliseconds
  max: 100, // Max number of requests allowed in the windowMs time frame
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: {
      message: 'Too many requests from this IP, please try again after 15 minutes.',
    },
  },
});

module.exports = apiLimiter;
