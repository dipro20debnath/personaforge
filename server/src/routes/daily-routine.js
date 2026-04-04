import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  try {
    const routine = db.prepare('SELECT routine FROM daily_routines WHERE user_id=? ORDER BY created_at DESC LIMIT 1').get(req.userId);
    if (!routine || !routine.routine) {
      return res.json({ routine: [] });
    }
    res.json({ routine: JSON.parse(routine.routine) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/', (req, res) => {
  try {
    const { routine } = req.body;
    if (!routine) return res.status(400).json({ error: 'Routine data required' });
    
    // Check if routine exists for today
    const existing = db.prepare('SELECT id FROM daily_routines WHERE user_id=? AND DATE(created_at)=DATE("now")').get(req.userId);
    
    if (existing) {
      db.prepare('UPDATE daily_routines SET routine=?, created_at=datetime("now") WHERE user_id=? AND DATE(created_at)=DATE("now")')
        .run(JSON.stringify(routine), req.userId);
    } else {
      db.prepare('INSERT INTO daily_routines (id, user_id, routine, created_at) VALUES (?, ?, ?, datetime("now"))')
        .run(uuid(), req.userId, JSON.stringify(routine));
    }
    
    res.json({ success: true, message: 'Routine saved' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
