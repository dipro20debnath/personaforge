import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/consents', (req, res) => {
  const consents = db.prepare('SELECT * FROM consent_records WHERE user_id=? ORDER BY ts DESC').all(req.userId);
  res.json(consents);
});

router.post('/consent', (req, res) => {
  const { purpose, granted } = req.body;
  db.prepare('INSERT INTO consent_records (id,user_id,purpose,granted) VALUES (?,?,?,?)').run(uuid(), req.userId, purpose, granted ? 1 : 0);
  res.json({ success: true });
});

router.get('/export', (req, res) => {
  const profile = db.prepare('SELECT p.*, u.email FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=?').get(req.userId);
  const assessments = db.prepare('SELECT * FROM assessments WHERE user_id=?').all(req.userId);
  const skills = db.prepare('SELECT * FROM skills WHERE user_id=?').all(req.userId);
  const goals = db.prepare('SELECT * FROM goals WHERE user_id=?').all(req.userId);
  const habits = db.prepare('SELECT * FROM habits WHERE user_id=?').all(req.userId);
  const journal = db.prepare('SELECT * FROM journal_entries WHERE user_id=?').all(req.userId);
  const data = { profile, assessments, skills, goals, habits, journal, exported_at: new Date().toISOString() };
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', 'attachment; filename=personaforge-data-export.json');
  res.json(data);
});

router.delete('/delete-account', (req, res) => {
  db.prepare('DELETE FROM users WHERE id=?').run(req.userId);
  res.json({ success: true, message: 'Account and all data deleted permanently.' });
});

export default router;
