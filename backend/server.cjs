// Entry point for VoxShield AI backend (CommonJS)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const detectRoute = require('./routes/detectRoute.cjs');
const {
  createLimiter,
  corsOptions,
  securityHeaders,
  requestLogger,
  errorHandler,
} = require('./middleware/security.cjs');

const app = express();

// Environment validation
if (!process.env.GEMINI_API_KEY) {
  console.warn('⚠️ Warning: GEMINI_API_KEY not found in environment variables');
}

// Security middleware
app.use(securityHeaders);
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(requestLogger);

// Rate limiting
const limiter = createLimiter(
  parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
);
app.use('/api/', limiter);

// API routes
app.use('/api', detectRoute);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'VoxShield AI Backend',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
  console.log(`🚀 VoxShield AI Backend started`);
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔧 Environment: ${NODE_ENV}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
});
