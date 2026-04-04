import { Router } from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();
router.use(authMiddleware);

router.get('/', (req, res) => {
  try {
    const profile = db.prepare('SELECT p.*, u.email FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=?').get(req.userId);
    if (!profile) return res.status(404).json({ error: 'Profile not found' });
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/', (req, res) => {
  try {
    const { display_name, bio, locale, timezone, dob, country, avatar_url } = req.body;
    db.prepare(`UPDATE profiles SET display_name=COALESCE(?,display_name), bio=COALESCE(?,bio), locale=COALESCE(?,locale), timezone=COALESCE(?,timezone), dob=COALESCE(?,dob), country=COALESCE(?,country), avatar_url=COALESCE(?,avatar_url), updated_at=datetime('now') WHERE user_id=?`)
      .run(display_name, bio, locale, timezone, dob, country, avatar_url, req.userId);
    const profile = db.prepare('SELECT p.*, u.email FROM profiles p JOIN users u ON u.id=p.user_id WHERE p.user_id=?').get(req.userId);
    res.json(profile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
