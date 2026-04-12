import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'personaforge-secret-key-change-in-production';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Invalid token format' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.userId = decoded.id;
    req.userRole = decoded.role || 'user';
    next();
  } catch {
    return res.status(401).json({ error: 'Token expired or invalid' });
  }
}

export function adminOnly(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.userRole !== 'admin' && req.userRole !== 'moderator') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
}

export function moderatorOnly(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (req.userRole !== 'admin' && req.userRole !== 'moderator') {
    return res.status(403).json({ error: 'Moderator access required' });
  }
  
  next();
}

export { SECRET };

