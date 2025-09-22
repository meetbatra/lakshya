const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./utils/database');
const chalk = require('chalk');
const { errorHandler, notFoundHandler } = require('./utils/errors');

// Load environment variables
dotenv.config();

// Import centralized routes
const apiRoutes = require('./routes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());

// Add security headers for Google OAuth
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(chalk.greenBright.bold(`🚀 Lakshya server running on port ${PORT}`));
  console.log(chalk.greenBright.bold(`📱 Environment: ${process.env.NODE_ENV}`));
});