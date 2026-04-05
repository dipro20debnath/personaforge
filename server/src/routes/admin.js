import { Router } from 'express';
import db from '../db.js';
import { adminMiddleware } from '../middleware/admin.js';

const router = Router();

// ============================================
// ADMIN DASHBOARD & ANALYTICS
// ============================================

router.get('/dashboard', adminMiddleware, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const activeUsers = db.prepare('SELECT COUNT(DISTINCT user_id) as count FROM profiles WHERE updated_at > datetime("now", "-7 days")').get().count || 0;
    const totalGoals = db.prepare('SELECT COUNT(*) as count FROM goals').get().count;
    const totalHabits = db.prepare('SELECT COUNT(*) as count FROM habits').get().count;
    const totalAssessments = db.prepare('SELECT COUNT(*) as count FROM personality_assessments').get().count;
    
    const recentUsers = db.prepare(`
      SELECT id, email, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `).all();

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        totalGoals,
        totalHabits,
        totalAssessments,
      },
      recentUsers,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// USER MANAGEMENT
// ============================================

router.get('/users', adminMiddleware, (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const users = db.prepare(`
      SELECT u.id, u.email, u.role, u.created_at, p.display_name, p.bio
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare('SELECT COUNT(*) as count FROM users').get().count;

    res.json({
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/users/:userId', adminMiddleware, (req, res) => {
  try {
    const user = db.prepare(`
      SELECT u.id, u.email, u.role, u.created_at, p.*
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `).get(req.params.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const goals = db.prepare('SELECT * FROM goals WHERE user_id = ?').all(user.id);
    const habits = db.prepare('SELECT * FROM habits WHERE user_id = ?').all(user.id);
    const journals = db.prepare('SELECT * FROM journal_entries WHERE user_id = ?').all(user.id);

    res.json({ user, goals, habits, journals });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/users/:userId/role', adminMiddleware, (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'moderator'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    db.prepare('UPDATE users SET role = ? WHERE id = ?').run(role, req.params.userId);
    res.json({ message: 'User role updated', role });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/users/:userId', adminMiddleware, (req, res) => {
  try {
    if (req.params.userId === req.userId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(req.params.userId);
    res.json({ message: 'User deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// SYSTEM LOGS & ACTIVITY
// ============================================

router.get('/logs', adminMiddleware, (req, res) => {
  try {
    const type = req.query.type || 'all';
    let query = 'SELECT * FROM system_logs';
    let params = [];

    if (type !== 'all') {
      query += ' WHERE type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';
    const logs = db.prepare(query).all(...params);

    res.json({ logs });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/logs/:logId/delete', adminMiddleware, (req, res) => {
  try {
    db.prepare('DELETE FROM system_logs WHERE id = ?').run(req.params.logId);
    res.json({ message: 'Log deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// CONTENT MODERATION
// ============================================

router.get('/content', adminMiddleware, (req, res) => {
  try {
    const journals = db.prepare(`
      SELECT id, user_id, content, flagged, created_at 
      FROM journal_entries 
      WHERE flagged = 1 OR content LIKE ? 
      LIMIT 50
    `).all('%admin%');

    res.json({ journals });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/content/:contentId/status', adminMiddleware, (req, res) => {
  try {
    const { status } = req.body;
    db.prepare('UPDATE journal_entries SET flagged = ? WHERE id = ?').run(
      status === 'flagged' ? 1 : 0,
      req.params.contentId
    );
    res.json({ message: 'Content status updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// SYSTEM SETTINGS
// ============================================

router.get('/settings', adminMiddleware, (req, res) => {
  try {
    const settings = db.prepare('SELECT * FROM admin_settings').all();
    res.json({ settings: Object.fromEntries(settings.map(s => [s.key, s.value])) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/settings', adminMiddleware, (req, res) => {
  try {
    const { key, value } = req.body;
    const existing = db.prepare('SELECT id FROM admin_settings WHERE key = ?').get(key);
    
    if (existing) {
      db.prepare('UPDATE admin_settings SET value = ? WHERE key = ?').run(value, key);
    } else {
      db.prepare('INSERT INTO admin_settings (key, value) VALUES (?, ?)').run(key, value);
    }

    res.json({ message: 'Setting updated', key, value });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ============================================
// DATABASE BACKUP & EXPORT
// ============================================

router.get('/backup/users', adminMiddleware, (req, res) => {
  try {
    const users = db.prepare('SELECT * FROM users').all();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="users-backup.json"');
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/stats/overview', adminMiddleware, (req, res) => {
  try {
    const stats = {
      users: db.prepare('SELECT COUNT(*) as count FROM users').get().count,
      goals: db.prepare('SELECT COUNT(*) as count FROM goals').get().count,
      habits: db.prepare('SELECT COUNT(*) as count FROM habits').get().count,
      journals: db.prepare('SELECT COUNT(*) as count FROM journal_entries').get().count,
      assessments: db.prepare('SELECT COUNT(*) as count FROM personality_assessments').get().count,
      assessmentDistribution: db.prepare(`
        SELECT personality_type, COUNT(*) as count 
        FROM personality_assessments 
        GROUP BY personality_type
      `).all(),
    };
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
