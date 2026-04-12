import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { SECRET } from '../middleware/auth.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const exists = await db.prepare('SELECT id FROM users WHERE email=?').get(email);
    if (exists) return res.status(409).json({ error: 'Email already registered' });
    const id = uuid();
    const hash = bcrypt.hashSync(password, 12);
    await db.prepare('INSERT INTO users (id,email,password,role) VALUES (?,?,?,?)').run(id, email, hash, 'user');
    await db.prepare('INSERT INTO profiles (user_id,display_name) VALUES (?,?)').run(id, name || email.split('@')[0]);
    // Create welcome notification
    await db.prepare('INSERT INTO notifications (id,user_id,type,title,message) VALUES (?,?,?,?,?)').run(uuid(), id, 'welcome', 'Welcome to PersonaForge!', 'Start by completing your personality assessment and setting up your profile.');
    const token = jwt.sign({ id, email, role: 'user' }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, email, role: 'user' } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    const user = await db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email, role: user.role } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin login endpoint - hardcoded for quick access
router.post('/admin-login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Hardcoded admin credentials
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'dipro@gmail.com';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Ak472002#@';
    
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminId = 'admin-' + Date.now();
      const token = jwt.sign({ id: adminId, email, role: 'admin' }, SECRET, { expiresIn: '7d' });
      res.json({ 
        token, 
        user: { 
          id: adminId, 
          email, 
          role: 'admin',
          name: 'Administrator'
        } 
      });
    } else {
      res.status(401).json({ error: 'Invalid admin credentials' });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
