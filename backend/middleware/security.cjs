// Security middleware and utilities
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const validator = require('validator');

// Rate limiting configuration
const createLimiter = (windowMs = 900000, maxRequests = 100) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => process.env.NODE_ENV === 'test',
  });
};

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.ALLOW_ORIGINS || 'http://localhost:5173,http://localhost:5174,http://localhost:3000').split(',');
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Input validation and sanitization
const validateInput = (data, maxLength = 10000) => {
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid input: expected string');
  }

  if (data.length > maxLength) {
    throw new Error(`Input exceeds maximum length of ${maxLength} characters`);
  }

  // Remove potentially harmful scripts
  const sanitized = validator.escape(data);
  return sanitized;
};

// Security headers middleware
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// API Key validation
const validateApiKey = (req, res, next) => {
  const internalApiKey = process.env.INTERNAL_API_KEY;
  const providedKey = req.headers['x-api-key'];

  // For public endpoints, skip validation
  // For admin endpoints, validate the API key
  if (req.path.startsWith('/api/admin') && internalApiKey && providedKey !== internalApiKey) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Don't expose internal error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  res.status(err.status || 500).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { details: err.stack }),
  });
};

module.exports = {
  createLimiter,
  corsOptions,
  validateInput,
  securityHeaders,
  validateApiKey,
  requestLogger,
  errorHandler,
  mongoSanitize,
};
