import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';

const router = Router();
router.use(authMiddleware);

router.get('/quote/:day', (req, res) => {
  try {
    const { day } = req.params;
    if (!day || day < 1 || day > 100) return res.status(400).json({ error: 'Invalid day (1-100)' });
    
    const quote = db.prepare('SELECT quote, author FROM daily_quotes WHERE day=?').get(parseInt(day));
    if (!quote) return res.status(404).json({ error: 'Quote not found' });
    
    res.json(quote);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/challenge', (req, res) => {
  try {
    const dailyChallenges = db.prepare('SELECT * FROM challenge_progress WHERE user_id=? ORDER BY day ASC').all(req.userId);
    let startDate = null;
    let todayDay = 1;
    
    if (dailyChallenges && dailyChallenges.length > 0) {
      // Get the entry for day 1 to determine the start date
      const dayOneEntry = db.prepare('SELECT created_at FROM challenge_progress WHERE user_id=? AND day=1').get(req.userId);
      
      if (dayOneEntry) {
        startDate = dayOneEntry.created_at.split(' ')[0]; // YYYY-MM-DD format
      }
      
      // Find the next uncompleted day, or if all are completed, use max day + 1
      const incompletedDay = dailyChallenges.find(c => !c.completed);
      if (incompletedDay) {
        // If there's an uncompleted day, that's today's challenge
        todayDay = incompletedDay.day;
      } else {
        // All visible days are completed, so find the next day (up to 100)
        const maxDay = Math.max(...dailyChallenges.map(c => c.day));
        todayDay = Math.min(maxDay + 1, 100);
      }
    }
    
    res.json({ dailyChallenges: dailyChallenges || [], startDate, todayDay });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/challenge/complete', (req, res) => {
  try {
    const { day } = req.body;
    if (!day) return res.status(400).json({ error: 'Day required' });
    
    // Check if already exists
    const existing = db.prepare('SELECT id FROM challenge_progress WHERE user_id=? AND day=?').get(req.userId, day);
    
    if (existing) {
      // Toggle completed status
      const current = db.prepare('SELECT completed FROM challenge_progress WHERE user_id=? AND day=?').get(req.userId, day);
      db.prepare('UPDATE challenge_progress SET completed=? WHERE user_id=? AND day=?')
        .run(current.completed ? 0 : 1, req.userId, day);
    } else {
      // Create new entry
      db.prepare('INSERT INTO challenge_progress (id, user_id, day, completed, created_at) VALUES (?, ?, ?, ?, datetime("now"))')
        .run(uuid(), req.userId, day, 1);
    }
    
    res.json({ success: true, message: `Day ${day} updated` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
