import express from 'express';
import db from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { v4 as uuid } from 'uuid';

const router = express.Router();

// Save voice command to history
router.post('/save-command', authMiddleware, (req, res) => {
  try {
    const { command, responseText, duration, success } = req.body;
    const userId = req.userId;

    if (!command || !responseText) {
      return res.status(400).json({ error: 'command and responseText required' });
    }

    const id = uuid();
    const timestamp = new Date().toISOString();

    db.prepare(
      `INSERT INTO voice_commands (id, user_id, command, response, duration, success, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, userId, command, responseText, duration || 0, success !== false ? 1 : 0, timestamp);

    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get voice command history
router.get('/history', authMiddleware, (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 50;

    const commands = db.prepare(
      `SELECT id, command, response, duration, success, created_at 
       FROM voice_commands 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`
    ).all(userId, limit);

    res.json(commands || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get voice stats
router.get('/stats', authMiddleware, (req, res) => {
  try {
    const userId = req.userId;

    const stats = db.prepare(
      `SELECT 
        COUNT(*) as total_commands,
        SUM(success) as successful_commands,
        AVG(duration) as avg_duration,
        MAX(created_at) as last_command
       FROM voice_commands 
       WHERE user_id = ?`
    ).get(userId);

    res.json({
      totalCommands: (stats && stats.total_commands) || 0,
      successfulCommands: (stats && stats.successful_commands) || 0,
      avgDuration: Math.round(((stats && stats.avg_duration) || 0) * 100) / 100,
      lastCommand: (stats && stats.last_command) || null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get command suggestions based on user patterns
router.get('/suggestions', authMiddleware, (req, res) => {
  try {
    const userId = req.userId;

    const commonCommands = db.prepare(
      `SELECT command, COUNT(*) as frequency 
       FROM voice_commands 
       WHERE user_id = ? AND success = 1
       GROUP BY command 
       ORDER BY frequency DESC 
       LIMIT 10`
    ).all(userId);

    res.json((commonCommands || []).map(row => ({
      command: row.command,
      frequency: row.frequency,
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced command: Add goal via voice
router.post('/commands/add-goal', authMiddleware, (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ error: 'Goal title is required' });
    }

    const id = uuid();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO goals (id, user_id, title, description, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, userId, title, description || '', 'active', now);

    res.json({ 
      success: true, 
      goal: { id, title, description, status: 'active' },
      message: `Goal "${title}" created successfully!`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced command: Add habit via voice
router.post('/commands/add-habit', authMiddleware, (req, res) => {
  try {
    const { name, frequency } = req.body;
    const userId = req.userId;

    if (!name) {
      return res.status(400).json({ error: 'Habit name is required' });
    }

    const id = uuid();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO habits (id, user_id, title, cadence, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`
    ).run(id, userId, name, frequency || 'daily', 'active', now);

    res.json({ 
      success: true, 
      habit: { id, name, frequency: frequency || 'daily', status: 'active' },
      message: `Habit "${name}" added successfully!`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced command: Record journal entry via voice
router.post('/commands/journal', authMiddleware, (req, res) => {
  try {
    const { content, mood } = req.body;
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ error: 'Journal content is required' });
    }

    const id = uuid();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO journal_entries (id, user_id, content, mood, created_at) 
       VALUES (?, ?, ?, ?, ?)`
    ).run(id, userId, content, mood || 'neutral', now);

    res.json({ 
      success: true, 
      entry: { id, content, mood: mood || 'neutral' },
      message: 'Journal entry saved successfully!'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Advanced command: Record money entry via voice
router.post('/commands/money-entry', authMiddleware, (req, res) => {
  try {
    const { amount, type, category, description } = req.body;
    const userId = req.userId;

    if (!amount || !type || !category) {
      return res.status(400).json({ error: 'amount, type, and category required' });
    }

    const id = uuid();
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO money_entries (id, user_id, amount, type, category, description, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(id, userId, amount, type, category, description || '', now);

    res.json({ 
      success: true, 
      entry: { id, amount, type, category, description },
      message: `${type.charAt(0).toUpperCase() + type.slice(1)} of $${amount} recorded!`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all voice-enabled features
router.get('/features', authMiddleware, (req, res) => {
  res.json({
    features: [
      {
        name: 'Goals',
        commands: ['add goal', 'show goals', 'complete goal'],
        actions: ['create', 'list', 'update']
      },
      {
        name: 'Habits',
        commands: ['add habit', 'show habits', 'check in habit'],
        actions: ['create', 'list', 'checkin']
      },
      {
        name: 'Journal',
        commands: ['journal entry', 'show journal'],
        actions: ['create', 'list']
      },
      {
        name: 'Money',
        commands: ['add income', 'add expense', 'show finances'],
        actions: ['income', 'expense', 'asset', 'liability']
      },
      {
        name: 'Motivation',
        commands: ['daily quote', 'show challenge'],
        actions: ['quote', 'challenge_progress']
      },
      {
        name: 'Daily Routine',
        commands: ['add routine', 'show routine'],
        actions: ['create', 'list']
      },
      {
        name: 'Dashboard',
        commands: ['show dashboard', 'how am i doing'],
        actions: ['overview']
      },
      {
        name: 'Profile',
        commands: ['show profile', 'tell me about me'],
        actions: ['view']
      }
    ]
  });
});

export default router;

