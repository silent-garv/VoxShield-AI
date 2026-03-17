// Configuration management
const config = {
  // Server config
  port: parseInt(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',

  // API config
  apiKeyRequired: false,
  internalApiKey: process.env.INTERNAL_API_KEY,

  // CORS config
  allowedOrigins: (process.env.ALLOW_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(','),

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // API endpoints
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    timeout: 10000,
    maxRetries: 3,
  },

  // Input validation
  validation: {
    maxTranscriptLength: 10000,
    maxMessageLength: 2000,
    maxPayloadSize: '10mb',
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: 'json',
  },

  // Security
  security: {
    hstsMaxAge: 31536000, // 1 year
    contentSecurityPolicy: true,
    frameguard: true,
    xssProtection: true,
  },

  // Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  },
};

// Validate required config on startup
const validateConfig = () => {
  const required = ['GEMINI_API_KEY', 'FIREBASE_PROJECT_ID'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.warn('⚠️ Missing environment variables:', missing.join(', '));
  }
};

module.exports = {
  config,
  validateConfig,
};
