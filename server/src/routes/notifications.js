import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  const notifs = db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY created_at DESC LIMIT 50').all(req.userId);
  const unread = db.prepare('SELECT COUNT(*) as c FROM notifications WHERE user_id=? AND read=0').get(req.userId);
  res.json({ notifications: notifs, unreadCount: unread.c });
});

router.put('/read/:id', (req, res) => {
  db.prepare('UPDATE notifications SET read=1 WHERE id=? AND user_id=?').run(req.params.id, req.userId);
  res.json({ success: true });
});

router.put('/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET read=1 WHERE user_id=?').run(req.userId);
  res.json({ success: true });
});

export default router;
