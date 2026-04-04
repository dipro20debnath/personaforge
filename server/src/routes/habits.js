import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const habits = db.prepare('SELECT * FROM habits WHERE user_id=? ORDER BY created_at DESC').all(req.userId);
  const today = new Date().toISOString().split('T')[0];
  const result = habits.map(h => {
    const checkins = db.prepare('SELECT * FROM habit_checkins WHERE habit_id=? ORDER BY day DESC LIMIT 30').all(h.id);
    const todayCheckin = checkins.find(c => c.day === today);
    return { ...h, checkins, completedToday: !!todayCheckin };
  });
  res.json(result);
});

router.post('/', (req, res) => {
  const { title, description, cadence, icon } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const id = uuid();
  db.prepare('INSERT INTO habits (id,user_id,title,description,cadence,icon) VALUES (?,?,?,?,?,?)')
    .run(id, req.userId, title, description||'', cadence||'daily', icon||'✅');
  db.prepare("UPDATE profiles SET xp = xp + 10 WHERE user_id=?").run(req.userId);
  res.json(db.prepare('SELECT * FROM habits WHERE id=?').get(id));
});

router.post('/:id/checkin', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const habit = db.prepare('SELECT * FROM habits WHERE id=? AND user_id=?').get(req.params.id, req.userId);
  if (!habit) return res.status(404).json({ error: 'Habit not found' });
  const existing = db.prepare('SELECT * FROM habit_checkins WHERE habit_id=? AND day=?').get(req.params.id, today);
  if (existing) return res.status(409).json({ error: 'Already checked in today' });
  db.prepare('INSERT INTO habit_checkins (id,habit_id,day,note) VALUES (?,?,?,?)').run(uuid(), req.params.id, today, req.body.note||'');
  // Update streak
  let streak = habit.streak + 1;
  const best = Math.max(streak, habit.best_streak);
  db.prepare('UPDATE habits SET streak=?, best_streak=? WHERE id=?').run(streak, best, req.params.id);
  db.prepare("UPDATE profiles SET xp = xp + 5 WHERE user_id=?").run(req.userId);
  if (streak % 7 === 0) {
    db.prepare('INSERT INTO notifications (id,user_id,type,title,message) VALUES (?,?,?,?,?)').run(uuid(), req.userId, 'streak', `${streak}-Day Streak! 🔥`, `Amazing! You\'ve maintained "${habit.title}" for ${streak} days!`);
  }
  res.json({ streak, best_streak: best });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM habits WHERE id=? AND user_id=?').run(req.params.id, req.userId);
  res.json({ success: true });
});

export default router;
