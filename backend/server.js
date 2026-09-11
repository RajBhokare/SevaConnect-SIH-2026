require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const matchRoutes = require('./routes/matchRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB with automatic fallback
connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// API Routes (supports both /api/xxx and /xxx for direct and serverless rewrites)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/workers', '/workers'], workerRoutes);
app.use(['/api/services', '/services'], serviceRoutes);
app.use(['/api/bookings', '/bookings'], bookingRoutes);
app.use(['/api/payments', '/payments'], paymentRoutes);
app.use(['/api/ratings', '/ratings'], ratingRoutes);
app.use(['/api/match', '/match'], matchRoutes);
app.use(['/api/ranking', '/ranking'], rankingRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({
    success: true,
    status: 'ok',
    message: 'SevaConnect backend is running',
    service: 'SevaConnect Backend API',
    mongoConnected: getDBStatus(),
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('SevaConnect Backend API is running.');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[SevaConnect Backend] Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
