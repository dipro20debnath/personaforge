import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/paths', (req, res) => {
  const paths = db.prepare('SELECT * FROM learning_paths').all();
  const result = paths.map(p => {
    const enrollment = db.prepare('SELECT * FROM learning_enrollments WHERE user_id=? AND path_id=?').get(req.userId, p.id);
    return { ...p, resources: JSON.parse(p.resources || '[]'), enrolled: !!enrollment, progress: enrollment?.progress || 0 };
  });
  res.json(result);
});

router.post('/enroll/:pathId', (req, res) => {
  const existing = db.prepare('SELECT * FROM learning_enrollments WHERE user_id=? AND path_id=?').get(req.userId, req.params.pathId);
  if (existing) return res.status(409).json({ error: 'Already enrolled' });
  const id = uuid();
  db.prepare('INSERT INTO learning_enrollments (id,user_id,path_id) VALUES (?,?,?)').run(id, req.userId, req.params.pathId);
  db.prepare("UPDATE profiles SET xp = xp + 10 WHERE user_id=?").run(req.userId);
  res.json({ success: true, id });
});

router.put('/progress/:pathId', (req, res) => {
  const { progress } = req.body;
  db.prepare('UPDATE learning_enrollments SET progress=? WHERE user_id=? AND path_id=?').run(progress, req.userId, req.params.pathId);
  if (progress >= 100) {
    db.prepare("UPDATE profiles SET xp = xp + 50 WHERE user_id=?").run(req.userId);
    db.prepare('INSERT INTO notifications (id,user_id,type,title,message) VALUES (?,?,?,?,?)').run(uuid(), req.userId, 'learning', 'Learning Path Complete! 📚', 'Great job finishing a learning path!');
  }
  res.json({ success: true });
});

export default router;
