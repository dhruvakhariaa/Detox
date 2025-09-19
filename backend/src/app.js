const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const apiLimiter = require('./middleware/rateLimit.middleware');

const app = express();

// --- Core Middleware Setup ---

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(morgan('dev'));

// Apply the rate limiting middleware to all requests
app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check Route ---
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Detox backend API is healthy!' });
});

module.exports = app;
