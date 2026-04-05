import { authMiddleware } from './auth.js';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import { SECRET } from './auth.js';

// Admin authentication middleware
export function adminMiddleware(req, res, next) {
  // First verify token
  authMiddleware(req, res, () => {
    // Then check admin status
    try {
      const user = db.prepare('SELECT role FROM users WHERE id=?').get(req.userId);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
      }
      next();
    } catch (e) {
      console.error('Admin check error:', e);
      return res.status(403).json({ error: 'Admin access required' });
    }
  });
}

export function optionalAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      req.isAdmin = false;
      return next();
    }
    const token = header.split(' ')[1];
    if (!token) {
      req.isAdmin = false;
      return next();
    }
    
    const decoded = jwt.verify(token, SECRET);
    const user = db.prepare('SELECT role FROM users WHERE id=?').get(decoded.id);
    req.userId = decoded.id;
    req.isAdmin = user && user.role === 'admin';
    next();
  } catch {
    req.isAdmin = false;
    next();
  }
}
