import { authMiddleware } from './auth.js';
import db from '../db.js';
import jwt from 'jsonwebtoken';
import { SECRET } from './auth.js';

// Admin authentication middleware
export function adminMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: 'No authorization header' });
    }
    
    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid authorization header' });
    }
    
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    
    // Check if token has admin role embedded
    if (decoded.role === 'admin') {
      return next();
    }
    
    // Otherwise check database
    try {
      const user = await db.prepare('SELECT role FROM users WHERE id=?').get(decoded.id);
      if (user && user.role === 'admin') {
        return next();
      }
    } catch (e) {
      console.error('Database check error:', e);
    }
    
    return res.status(403).json({ error: 'Admin access required' });
  } catch (e) {
    console.error('Admin middleware error:', e.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
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
    req.userId = decoded.id;
    req.userRole = decoded.role;
    req.isAdmin = decoded.role === 'admin';
    next();
  } catch {
    req.isAdmin = false;
    next();
  }
}
