import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { IPIP_QUESTIONS } from '../data/ipip-questions.js';

const router = Router();
router.use(authMiddleware);

router.get('/questions', (_req, res) => {
  res.json(IPIP_QUESTIONS);
});

router.post('/submit', (req, res) => {
  try {
    const { responses } = req.body; // { q1: 4, q2: 2, ... }
    if (!responses || typeof responses !== 'object') return res.status(400).json({ error: 'Responses required' });

    // Score Big Five
    const traits = { openness: [], conscientiousness: [], extraversion: [], agreeableness: [], neuroticism: [] };
    for (const q of IPIP_QUESTIONS) {
      const val = responses[q.id];
      if (val === undefined) continue;
      const score = q.reverse ? (6 - val) : val;
      traits[q.trait].push(score);
    }
    const avg = (arr) => arr.length ? +(arr.reduce((a,b) => a+b, 0) / arr.length).toFixed(2) : 0;
    const scores = {
      openness: avg(traits.openness),
      conscientiousness: avg(traits.conscientiousness),
      extraversion: avg(traits.extraversion),
      agreeableness: avg(traits.agreeableness),
      neuroticism: avg(traits.neuroticism),
    };

    const id = uuid();
    db.prepare('INSERT INTO assessments (id,user_id,openness,conscientiousness,extraversion,agreeableness,neuroticism,responses) VALUES (?,?,?,?,?,?,?,?)')
      .run(id, req.userId, scores.openness, scores.conscientiousness, scores.extraversion, scores.agreeableness, scores.neuroticism, JSON.stringify(responses));

    // Add XP
    db.prepare("UPDATE profiles SET xp = xp + 50 WHERE user_id=?").run(req.userId);
    // Notification
    db.prepare('INSERT INTO notifications (id,user_id,type,title,message) VALUES (?,?,?,?,?)').run(uuid(), req.userId, 'assessment', 'Assessment Complete!', 'Your Big Five personality profile has been updated. Check your dashboard!');

    res.json({ id, ...scores });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/latest', (req, res) => {
  const assessment = db.prepare('SELECT * FROM assessments WHERE user_id=? ORDER BY created_at DESC LIMIT 1').get(req.userId);
  res.json(assessment || null);
});

router.get('/history', (req, res) => {
  const list = db.prepare('SELECT * FROM assessments WHERE user_id=? ORDER BY created_at DESC').all(req.userId);
  res.json(list);
});

export default router;
