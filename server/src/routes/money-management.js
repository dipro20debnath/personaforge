import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  try {
    const entries = db.prepare('SELECT * FROM money_entries WHERE user_id=? ORDER BY date DESC').all(req.userId);
    res.json({ entries: entries || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/entry', (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    
    if (!type || !category || !amount || !description) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const id = uuid();
    db.prepare(`
      INSERT INTO money_entries (id, user_id, type, category, amount, description, date, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).run(id, req.userId, type, category, parseFloat(amount), description, date);

    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/entry', (req, res) => {
  try {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'ID required' });
    
    db.prepare('DELETE FROM money_entries WHERE id=? AND user_id=?').run(id, req.userId);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
