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
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// 404 handler for undefined routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(chalk.greenBright.bold(`🚀 Lakshya server running on port ${PORT}`));
  console.log(chalk.greenBright.bold(`📱 Environment: ${process.env.NODE_ENV}`));
});