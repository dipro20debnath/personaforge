import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { SECRET } from '../middleware/auth.js';

const router = Router();

// Admin login endpoint
router.post('/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hardcoded admin credentials from environment or defaults
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dipro@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ak472002#@';
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminId = 'admin-' + Date.now();
      const token = jwt.sign({ id: adminId, email, role: 'admin' }, SECRET, { expiresIn: '7d' });
      return res.json({ 
        token, 
        user: { 
          id: adminId, 
          email, 
          role: 'admin',
          name: 'Administrator'
        } 
      });
    }
    
    return res.status(401).json({ error: 'Invalid admin credentials' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

export default router;
