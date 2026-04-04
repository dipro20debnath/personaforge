import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, param, query, validationResult } from 'express-validator';

// Security headers with Helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
});

// Rate limiters with different thresholds
export const limiters = {
  general: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
  }),

  auth: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    skipSuccessfulRequests: true,
    message: 'Too many login attempts, please try again later',
  }),

  strict: rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many requests for this operation',
  }),

  ai: rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'AI request limit exceeded, please try again later',
  }),
};

// Input validators
export const validators = {
  register: [
    body('email').isEmail().normalizeEmail(),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain uppercase letter')
      .matches(/[a-z]/)
      .withMessage('Password must contain lowercase letter')
      .matches(/\d/)
      .withMessage('Password must contain number'),
    body('name').isLength({ min: 2 }).trim(),
  ],

  login: [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],

  goal: [
    body('title').isLength({ min: 3, max: 200 }).trim(),
    body('description').optional().isLength({ max: 2000 }).trim(),
    body('status').optional().isIn(['not-started', 'in-progress', 'completed']),
    body('category').optional().isString().trim(),
  ],

  habit: [
    body('name').isLength({ min: 2, max: 100 }).trim(),
    body('frequency').isIn(['daily', 'weekly', 'monthly']),
    body('description').optional().isLength({ max: 500 }).trim(),
  ],

  skill: [
    body('name').isLength({ min: 2, max: 100 }).trim(),
    body('proficiency').isIn(['beginner', 'intermediate', 'advanced', 'expert']),
  ],

  profile: [
    body('bio').optional().isLength({ max: 500 }).trim(),
    body('location').optional().isLength({ max: 100 }).trim(),
    body('phone').optional().isMobilePhone(),
  ],

  id: [
    param('id').isUUID(),
  ],

  pagination: [
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 100 }),
  ],
};

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Sanitization utilities
export const sanitize = {
  preventSQLInjection: (input) => {
    if (typeof input !== 'string') return input;
    return input.replace(/['";]/g, '').replace(/;/g, '');
  },

  preventXSS: (input) => {
    if (typeof input !== 'string') return input;
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  trim: (input) => {
    return typeof input === 'string' ? input.trim() : input;
  },
};

// CORS configuration
export const corsOptions = {
  origin: function (origin, callback) {
    const whitelist = [
      'http://localhost:3000',
      'http://localhost:5000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5000',
    ];

    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Security logging
export const securityLogging = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, path, ip } = req;
  const userAgent = req.get('user-agent');

  console.log(`[${timestamp}] ${method} ${path} - IP: ${ip}`);

  next();
};

// Secure error handler
export const secureErrorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const timestamp = new Date().toISOString();

  console.error(`[${timestamp}] Error:`, err);

  if (isDevelopment) {
    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }

  // Production: don't leak error details
  res.status(500).json({
    error: 'Internal server error',
    timestamp,
  });
};

export default {
  securityHeaders,
  limiters,
  validators,
  handleValidationErrors,
  sanitize,
  corsOptions,
  securityLogging,
  secureErrorHandler,
};
