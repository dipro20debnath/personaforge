import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const skills = db.prepare('SELECT * FROM skills WHERE user_id=? ORDER BY updated_at DESC').all(req.userId);
  res.json(skills.map(s => ({ ...s, evidence: JSON.parse(s.evidence || '[]') })));
});

router.post('/', (req, res) => {
  const { name, category, self_level, target_level, world_avg } = req.body;
  if (!name) return res.status(400).json({ error: 'Skill name required' });
  const id = uuid();
  db.prepare('INSERT INTO skills (id,user_id,name,category,self_level,target_level,world_avg) VALUES (?,?,?,?,?,?,?)')
    .run(id, req.userId, name, category||'general', self_level||1, target_level||5, world_avg||3.0);
  db.prepare("UPDATE profiles SET xp = xp + 10 WHERE user_id=?").run(req.userId);
  res.json(db.prepare('SELECT * FROM skills WHERE id=?').get(id));
});

router.put('/:id', (req, res) => {
  const { self_level, target_level, evidence } = req.body;
  db.prepare("UPDATE skills SET self_level=COALESCE(?,self_level), target_level=COALESCE(?,target_level), evidence=COALESCE(?,evidence), updated_at=datetime('now') WHERE id=? AND user_id=?")
    .run(self_level, target_level, evidence ? JSON.stringify(evidence) : null, req.params.id, req.userId);
  res.json(db.prepare('SELECT * FROM skills WHERE id=?').get(req.params.id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM skills WHERE id=? AND user_id=?').run(req.params.id, req.userId);
  res.json({ success: true });
});

export default router;
