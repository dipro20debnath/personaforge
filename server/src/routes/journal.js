import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

const PROMPTS = [
  "What are you grateful for today?",
  "What's one thing you learned today?",
  "Describe a challenge you faced and how you handled it.",
  "What would you tell your future self?",
  "What made you smile today?",
  "What's one habit you'd like to build?",
  "Reflect on a recent accomplishment.",
  "What's something you'd like to improve about yourself?",
  "Describe your ideal day.",
  "What fear would you like to overcome?",
];

router.get('/prompt', (_req, res) => {
  res.json({ prompt: PROMPTS[Math.floor(Math.random() * PROMPTS.length)] });
});

router.get('/', (req, res) => {
  const { tag, mood, search, limit } = req.query;
  let query = 'SELECT * FROM journal_entries WHERE user_id=?';
  const params = [req.userId];
  if (mood) { query += ' AND mood=?'; params.push(mood); }
  if (search) { query += ' AND (title LIKE ? OR content LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  query += ' ORDER BY created_at DESC';
  if (limit) { query += ' LIMIT ?'; params.push(parseInt(limit)); }
  const entries = db.prepare(query).all(...params);
  let result = entries.map(e => ({ ...e, tags: JSON.parse(e.tags || '[]') }));
  if (tag) result = result.filter(e => e.tags.includes(tag));
  res.json(result);
});

router.post('/', (req, res) => {
  const { title, content, mood, tags } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });
  const id = uuid();
  const xp = 10;
  db.prepare('INSERT INTO journal_entries (id,user_id,title,content,mood,tags,xp_earned) VALUES (?,?,?,?,?,?,?)')
    .run(id, req.userId, title||'', content, mood||'neutral', JSON.stringify(tags||[]), xp);
  db.prepare("UPDATE profiles SET xp = xp + ? WHERE user_id=?").run(xp, req.userId);
  res.json(db.prepare('SELECT * FROM journal_entries WHERE id=?').get(id));
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM journal_entries WHERE id=? AND user_id=?').run(req.params.id, req.userId);
  res.json({ success: true });
});

export default router;
