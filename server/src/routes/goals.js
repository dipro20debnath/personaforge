import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const goals = db.prepare('SELECT * FROM goals WHERE user_id=? ORDER BY created_at DESC').all(req.userId);
  const result = goals.map(g => {
    const milestones = db.prepare('SELECT * FROM goal_milestones WHERE goal_id=? ORDER BY due_at').all(g.id);
    return { ...g, milestones };
  });
  res.json(result);
});

router.post('/', (req, res) => {
  const { title, description, metric, target_value, due_at, category, milestones } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const id = uuid();
  db.prepare('INSERT INTO goals (id,user_id,title,description,metric,target_value,due_at,category) VALUES (?,?,?,?,?,?,?,?)')
    .run(id, req.userId, title, description||'', metric||'', target_value||100, due_at||null, category||'personal');
  if (milestones && Array.isArray(milestones)) {
    const ins = db.prepare('INSERT INTO goal_milestones (id,goal_id,title,due_at) VALUES (?,?,?,?)');
    for (const m of milestones) ins.run(uuid(), id, m.title, m.due_at||null);
  }
  db.prepare("UPDATE profiles SET xp = xp + 15 WHERE user_id=?").run(req.userId);
  const goal = db.prepare('SELECT * FROM goals WHERE id=?').get(id);
  const ms = db.prepare('SELECT * FROM goal_milestones WHERE goal_id=?').all(id);
  res.json({ ...goal, milestones: ms });
});

router.put('/:id', (req, res) => {
  const { title, current_value, status } = req.body;
  db.prepare("UPDATE goals SET title=COALESCE(?,title), current_value=COALESCE(?,current_value), status=COALESCE(?,status) WHERE id=? AND user_id=?")
    .run(title, current_value, status, req.params.id, req.userId);
  if (status === 'completed') {
    db.prepare("UPDATE profiles SET xp = xp + 100 WHERE user_id=?").run(req.userId);
    db.prepare('INSERT INTO notifications (id,user_id,type,title,message) VALUES (?,?,?,?,?)').run(uuid(), req.userId, 'goal', 'Goal Achieved! 🎉', `Congratulations! You completed: ${title}`);
  }
  res.json(db.prepare('SELECT * FROM goals WHERE id=?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM goals WHERE id=? AND user_id=?').run(req.params.id, req.userId);
  res.json({ success: true });
});

router.put('/milestone/:id', (req, res) => {
  const { done } = req.body;
  db.prepare('UPDATE goal_milestones SET done=? WHERE id=?').run(done ? 1 : 0, req.params.id);
  res.json({ success: true });
});

export default router;
